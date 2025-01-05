---
title: "Taming the CI Beast: Optimizing a Massive Next.js Application (Part 1)"
description: "How we slashed CI build times and empowered a team of 100+ developers by tackling performance bottlenecks in a massive Next.js application."
date: "January 5, 2025" 
---

![Taming the CI beast](/2025-01-05/taming-the-ci-beast-intro.png) 

It all started with a behemoth of a Next.js application.  **15,000 files, 107,000 lines of code, and a staggering 18,000 unit tests.**  This was the beast we inherited at Leboncoin.fr, and its CI pipeline was, to put it mildly, a bit of a nightmare.

## The Problem:  A 50-Minute Wait (and Growing!)

Our initial encounter with the CI process was less than ideal.  Average build times were hovering around **50 minutes**, with some builds dragging on for **2 hours**.  

Now, imagine you're one of the **70 frontend developers (and growing!)** working on this codebase.  Every time you open a pull request, you're faced with an **hour-long wait** *just* to merge your changes.  Code reviews?  Forget about quick turnarounds.

This wasn't just a minor inconvenience; it was a major productivity killer.  Something had to be done.

## The Initial Approach:  GitHub Actions and Parallelism

We knew we needed to migrate from Travis CI to GitHub Actions, and fast.  Travis had its limitations, including capped resources and a reliance on Docker containers for everything.  GitHub Actions, running on our own Kubernetes cluster, offered more flexibility and scalability.

Our first strategy was to tackle the slowest part of the pipeline: the Jest tests.  We shifted the testing process to GitHub Actions, hoping that bigger machines would help.  We started with 8 vCPUs and 8GB of RAM, but the gains were minimal.

Then, we discovered a culprit: the `--runInBand` flag in our Jest configuration.  This flag forces Jest to run tests sequentially, one at a time.  With **18,000 tests**, you can imagine the impact!

## Sharding Woes and a New Direction

Removing `--runInBand` led to memory issues when using multiple Jest workers.  So, we tried [sharding](https://jestjs.io/docs/next/cli#--shard), a technique that splits tests into smaller groups to run concurrently.  

Unfortunately, sharding proved to be another bottleneck.  With so many tests, and some generated dynamically, Jest spent an eternity just figuring out how to split them.  We were losing more time calculating shards than running tests!

We needed a more nuanced approach. We decided to combine splitting the tests by logical parts (folders, domains) with sharding, applying sharding only to those parts that were still too large to run efficiently on a single runner.  

Here's a snippet of our GitHub Actions workflow showcasing our combined strategy:

```yaml
run-tests:
    runs-on: [org/leboncoin, size/medium]
    needs: install-dependencies
    strategy:
      matrix:
        shard:
          [
            { path: 'src/{__tests__,client,hooks,decorators,tracking,utils}', shard: '1/1' },
            { path: 'src\/components\/[0-9A-Ma-m].*', shard: '1/1' },
            { path: 'src\/components\/[N-Sn-s].*', shard: '1/1' },
            { path: 'src\/components\/[T-Zt-z].*', shard: '1/1' },
            { path: 'src/{layouts,services,state}', shard: '1/2' },
            { path: 'src/{layouts,services,state}', shard: '2/2' },
            { path: 'src\/pages\/[0-9].*', shard: '1/1' },
            { path: 'src\/pages\/[Aa][A-Ca-c].*', shard: '1/4' },
            { path: 'src\/pages\/[Aa][A-Ca-c].*', shard: '2/4' },
            { path: 'src\/pages\/[Aa][A-Ca-c].*', shard: '3/4' },
            { path: 'src\/pages\/[Aa][A-Ca-c].*', shard: '4/4' },
            { path: 'src\/pages\/[Aa][Dd][Ll].*', shard: '1/1' },
            { path: 'src\/pages\/[Aa][Dd][Ml].*', shard: '1/1' },
            { path: 'src\/pages\/[Aa][D-Zd-z][N-Z-n-z].*', shard: '1/1' },
            { path: 'src\/pages\/[B-Db-d].*', shard: '1/3' },
            { path: 'src\/pages\/[B-Db-d].*', shard: '2/3' },
            { path: 'src\/pages\/[B-Db-d].*', shard: '3/3' },
            { path: 'src\/pages\/[E-Oe-o].*', shard: '1/2' },
            { path: 'src\/pages\/[E-Oe-o].*', shard: '2/2' },
            { path: 'src\/pages\/[P-Rp-r].*', shard: '1/4' },
            { path: 'src\/pages\/[P-Rp-r].*', shard: '2/4' },
            { path: 'src\/pages\/[P-Rp-r].*', shard: '3/4' },
            { path: 'src\/pages\/[P-Rp-r].*', shard: '4/4' },
            { path: 'src\/pages\/[S-Zs-z].*', shard: '1/1' },
          ]
    steps:
```

This approach allowed us to leverage the benefits of sharding without incurring the excessive overhead of calculating shards for the entire test suite.

## Victory! (But at What Cost?)

The results were impressive. Test times plummeted from an average of **50 minutes to just 5 minutes!** That's a **90% reduction** in test execution time! We had conquered the slowest part of the CI pipeline.

But something didn't feel right. We were now running **24 test groups**, each on a 4 vCPU, 4GB RAM virtual machine. It felt like we were throwing money (or hardware) at the problem instead of addressing the root cause.

This, combined with the fact that our production application required a massive number of Kubernetes pods (**averaging 500!**), led us to suspect deeper performance issues lurking within the code.

## Profiling and the Hunt for Bottlenecks

We embarked on a mission to profile the application, searching for memory leaks, CPU hogs, and any other performance gremlins that might be contributing to our woes.

[(To be continued...)](/blog/04-taming-the-ci-beast-part-2)