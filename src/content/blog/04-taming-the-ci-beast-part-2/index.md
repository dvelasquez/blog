---
title: "Taming the CI Beast: Optimizing a Massive Next.js Application (Part 2)"
description: "Delving into memory management and Jest worker optimization to further tame the CI beast and uncover hidden performance bottlenecks."
date: "January 6, 2025" 
---

![Taming the CI beast](/2025-01-06/taming-the-ci-beast-intro.png) 

In the [previous article](/blog/03-taming-the-ci-beast), we embarked on a quest to tame the unruly CI pipeline of a massive Next.js application at Leboncoin.fr.  We tackled the daunting task of optimizing **18,000 unit tests** and managed to reduce test execution time from **50 minutes to just 5 minutes** by strategically splitting the tests and leveraging GitHub Actions.

But our victory felt incomplete.  Running **24 test groups** on separate virtual machines, even with reduced specs (4 vCPU, 4GB RAM), seemed excessive.  We suspected deeper performance issues were lurking within the application, impacting both CI times and production resource usage.

##  Unsustainable Sharding and the Memory Mystery

Our initial sharding strategy, while effective, had drawbacks.  It required manual maintenance whenever new paths were added to the codebase, and we suspected it wasn't addressing the root cause of our performance woes: potential memory leaks.

We began investigating memory consumption, particularly within the Jest tests.  We noticed frequent "out of memory" errors, indicating a need to delve into Jest's parallelism and memory management.

## Jest Workers and the `--workerThreads` Flag

Jest offers two ways to create workers for parallel test execution:

1. **Spawning Processes:**  Creating separate Jest processes for each worker.
2. **Node.js Workers:** Utilizing Node.js worker threads.

The `--workerThreads` flag allows you to control this behavior (see the [Jest documentation](https://jestjs.io/docs/next/cli#--workerthreads) for details).

While we could have tried using gigantic virtual machines with increased Node.js memory limits (`--max-old-space-size`), this felt like throwing money at the problem again.  We needed to understand the underlying issue.

## The Node.js Caching Conundrum

Here's what we discovered:  Each time a Jest worker loaded a test file, it also loaded all the dependencies required by that test (React, date-fns, etc.).  Ideally, these dependencies should be cached and reused across tests.  However, due to a [known issue in Node.js](https://github.com/jestjs/jest/issues/11956), the cache wasn't being utilized effectively.

We confirmed this behavior using the `--logHeapMemory` flag in Jest, which revealed that each worker's memory usage grew rapidly as it loaded the same dependencies repeatedly.  This led to frequent garbage collection cycles, further slowing down the tests.

##  `workerIdleMemoryLimit` to the Rescue

Fortunately, Jest provides a configuration option called `workerIdleMemoryLimit` (see the [docs](https://jestjs.io/docs/next/configuration#workeridlememorylimit-numberstring)).  This option allows you to set a memory limit for each worker.  When a worker exceeds this limit, Jest automatically kills it, releasing its memory, and creates a new worker.  This proactive approach is far more efficient than relying on Node.js's garbage collection.

By setting an appropriate `workerIdleMemoryLimit`, we could prevent workers from hitting memory limits and avoid the performance penalties of excessive garbage collection.

##  Our Final Configuration

Our final Jest configuration included:

```javascript
workerIdleMemoryLimit: "900MB",
```

We also decided to consolidate our testing onto a single, more powerful virtual machine (16 vCPU, 16GB RAM) and run **15 Jest workers** with the memory limit.  This allowed us to execute all tests in under **6 minutes** on a single machine!

## The Build Bottleneck

With the testing bottleneck resolved, the build process became the slowest part of our CI pipeline.  Reducing the build time from 15 minutes proved to be a much harder challenge.

(To be continued...)