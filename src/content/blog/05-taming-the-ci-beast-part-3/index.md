---
title: "Taming the CI Beast: Optimizing a Massive Next.js Application (Part 3)"
description: "Reduce CI build times by optimizing the build process and Docker image creation for a massive Next.js application. Learn how we achieved a 9-minute CI pipeline!" 
date: "January 11, 2025" 
keywords: "CI/CD, Next.js, Docker, performance optimization, build process, developer productivity, GitHub Actions, continuous integration, continuous deployment"
---

![Optimizing the Build Process](/2025-01-11/taming-the-ci-beast-intro.png) 

In the previous articles ([Part 1](/blog/03-taming-the-ci-beast) and [Part 2](/blog/04-taming-the-ci-beast-part-2)), we embarked on a quest to tame the CI/CD pipeline of a massive Next.js application. We tackled Jest test optimization, reducing execution time from **50 minutes to just 6 minutes**!

But our journey wasn't over.  The build process, clocking in at **15 minutes**, remained a significant bottleneck.  It was time to turn our attention to optimizing the build itself and how we packaged our application into Docker images.

## The .next/cache Conundrum

Our initial build process, inherited from the Travis CI days, had a critical flaw: it didn't utilize the .next/cache directory effectively.  This directory stores cached build artifacts, significantly speeding up subsequent builds.  However, due to Docker's limitations with writable volumes during the image build process, we couldn't easily persist this cache.

Furthermore, including the .next/cache directory in the final Docker image significantly increased its size, leading to slower deployments and increased storage costs.

We needed a solution that would:

* Allow us to leverage the .next/cache for faster builds.
* Prevent this cache from bloating our Docker images.

## Exploring Solutions

We considered two main options:

**Option 1: Multi-stage Docker Build with `docker run`**

This approach involved creating multiple Docker images, each representing a stage in the build process:

* Base Image:  Containing the OS, Node.js, and npm.
* Dependencies Image:  Adding project dependencies.
* Build Image:  Running `npm run build` and storing the output in a shared volume.
* Final Image:  Copying the compiled files from the shared volume.

**Option 2: Build in CI and Copy to Docker Image**

This simpler approach involved building the application directly in the CI environment and then copying the compiled files into a Docker image.

## Decision Time:  Balancing Speed and Portability

After careful consideration, we opted for **Option 2: Build in CI and Copy to Docker Image**.  This decision was driven by several factors:

* **Speed:**  Building directly in the CI environment was faster due to fewer layers of virtualization.
* **Simplicity:**  This approach closely mirrored our local development workflow, making it easier to understand and maintain.
* **Reduced Docker Image Size:**  Excluding the .next/cache from the final image resulted in smaller and more efficient deployments.

While Option 1 offered more portability and a "Docker-native" approach, we prioritized speed and simplicity for our specific needs.

## The Results:  Shaving Off Precious Minutes

The impact of this change was significant.  We reduced build times by **6-8 minutes**, a substantial improvement for a process that was already taking 15 minutes.

More importantly, this approach allowed Next.js to effectively utilize its caching mechanisms, reducing unnecessary recompilation and minimizing browser cache busting.

##  A Glimpse into Our Build Workflow

Our final build workflow incorporates several key elements:

* **Pre-build Hook:**  A JavaScript script (prebuild.mjs) creates the .env file with environment variables based on the target environment (e.g., development, staging, production).

```javascript
#!/usr/bin/env node
// Utility to run before npm run build on github actions.
import { execSync } from 'child_process'

const availableEnvironments = ['local', 'staging', 'production'] 
const ENVIRONMENT = process.env.ENVIRONMENT || 'local'

try {
  // Check if the environment is valid
  if (!availableEnvironments.includes(ENVIRONMENT)) {
    throw new Error(
      'Invalid environment to build: ' + ENVIRONMENT + '. Environment should be one of ' + availableEnvironments.join(
        ', '
      )
    )
  }
  // Environment is valid, let's build the env file
  console.info('Building env file for "' + ENVIRONMENT + '" environment')  
  execSync('node ./bin/scripts/jsConfigToEnv.js env.' + ENVIRONMENT + '.js .env') 

  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
```

* Post-build Hook:  Another JavaScript script (postBuild.mjs) removes non-productive dependencies (like eslint, prettier) to reduce the final Docker image size.

```javascript
#!/usr/bin/env node
// This script is responsible for removing dev dependencies from the node_modules folder after the build
// Ideally, this should only run on github actions
import { execSync } from 'child_process'
console.info('Removing dev dependencies from node_modules, 
if you are running this locally, you might need to running npm install again.')
// Remove dev dependencies
const stdout = execSync('npm prune --omit=dev')
console.info(stdout.toString());
```

* Automated Deployment:  Our CI pipeline automatically triggers deployments to the appropriate environments (e.g., staging, production) upon successful builds.

By streamlining the build process and optimizing our Docker images, we further tamed the CI beast and empowered our developers with faster feedback loops and more efficient deployments.

With these optimizations in place, our CI pipeline now completes in **just 9 minutes**, a significant improvement from the initial **50-minute (or longer!)** build times. This faster feedback loop has greatly improved developer productivity and allowed us to deliver value to our users more quickly.