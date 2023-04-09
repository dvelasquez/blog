---
title: Debugging development performance in a NextJS application
published_at: "2020-04-19T19:15:32.169Z"
template: "post"
draft: false
slug: "debugging-development-performance-nextjs"
category: "debug"
tags:
  - performance
  - ssr
  - nextjs
  - developer experience
  - nodejs
  - server side render
description: "Analysis, diagnostic and fix of a performance problem in a NextJS Application."
socialImage: "media/next.jslogo.png"
---

# TLDR

- Keep your dependencies up to date
  - Upgrade the prom-client library to at least version 11.
  - Check once in a while when was the last update of your dependencies
- Remove unnecessary transpilations in the server
- Improve the transpilations rules in next.config.js

# A little of context

One of the **great perks** I have at work (aside of occasionally fly to other
countries) is to work with websites that are in the **top 10 of the most visited
sites in their countries**. The opportunity of improve and make a website that
is very important for so many people. This is an **exciting** and **humbling**
experience.

In many cases, the local teams are **continually busy improving the product from
a business perspective**, and they don't have all the time they would like to
**focus, explore and improve** their sites **technically**, and this is the cue
for me to help.

# Why development mode in this application is slow?

During the time working with this local team, we noticed that the **NextJS
application is very slow in development mode**, due to unknown reasons.

Other projects similar in size and technologies seem to not have this problem.

## Comparison table

| Project                                       | Boot time | Hot Reload time |
| --------------------------------------------- | --------- | --------------- |
| Fresh NextJS Installation                     | ~3 sec    | ~1.5 sec        |
| Marketplace in Tunisia and Dominican Republic | ~15 sec   | ~5 sec          |
| **Marketplace in Belarus**                    | 1 - 2 min | 30 - 60 sec     |

Comparatively the Belarusian site is **4X - 8X slower** than the project from
**Tunisia and Dominican Republic**, which uses similar technologies and tools.

## Diagnostic

Since this error arises when running the application, and it seems related to
compilation/building/execution time, we should look for a way to get data of
what is happening inside NodeJS.

For this, **NodeJS** provides the `--prof` command-line argument. This creates a
profiling file on which we can get a summary of the results. More information
here: https://nodejs.org/es/docs/guides/simple-profiling/

After running the profiling for both, development mode and production mode,
these are my findings

## Development

These are the results of the profiling. Profiling gets a sample of what is
happening inside the V8 engine and stores them. The first clue is in the
distribution of the samples.

Most of them are in the C++ section, instead of JavaScript.

| Ticks  | Total | nonlib | Name             |
| ------ | ----- | ------ | ---------------- |
| 17587  | 9.5%  | 9.6%   | JavaScript       |
| 165016 | 88.8% | 90.0%  | C++              |
| 5324   | 2.9%  | 2.9%   | GC               |
| 2406   | 1.3%  | -      | Shared libraries |
| 804    | 0.4%  | -      | Unaccounted      |

**Bottom-up (heavy) profile:**

| ticks | parent | name                                                                                                                               |
| ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 82034 | 44.1%  | T _host_get_clock_service                                                                                                          |
| 70368 | 37.9%  | T __ZN2v88internal21Builtin_MakeTypeErrorEiPmPNS0_7IsolateE                                                                        |
| 17996 | 25.6%  | LazyCompile: *getHeapSpaceStatistics v8.js:146:32                                                                                  |
| 17796 | 98.9%  | LazyCompile: *<anonymous> /Users/danilo.velazquez/dev/@kufar/kufar-fe/node_modules/prometheus-plugin-heap-stats/lib/index.js:74:22 |

**So what does that means?**

In synthesis, the single function that is being called and draining the **44.1%
of the CPU** is a call to get the current date. Following by the
**getHeapSpaceStatistics** and the **prometheus-plugin-heap-stats**.

_So, what about production?_

## Production

The results for the production mode were _slightly different_, as we can see in
the following table:

| Ticks  | Total | nonlib | Name             |
| ------ | ----- | ------ | ---------------- |
| 22031  | 10.4% | 10.5%  | JavaScript       |
| 182960 | 86.4% | 87.5%  | C++              |
| 9325   | 4.4%  | 4.5%   | GC               |
| 2562   | 1.2%  | -      | Shared libraries |
| 4096   | 1.9%  | -      | Unaccounted      |

**Bottom-up (heavy) profile:**

| ticks | parent | name                                                                                                                               |
| ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 98430 | 46.5%  | T __ZN2v88internal21Builtin_MakeTypeErrorEiPmPNS0_7IsolateE                                                                        |
| 27331 | 27.8%  | LazyCompile: *getHeapSpaceStatistics v8.js:146:32                                                                                  |
| 27261 | 99.7%  | LazyCompile: *<anonymous> /Users/danilo.velazquez/dev/@kufar/kufar-fe/node_modules/prometheus-plugin-heap-stats/lib/index.js:74:22 |
| 27254 | 100%   | LazyCompile: *listOnTimeout internal/timers.js:480:25                                                                              |
| 27254 | 100%   | LazyCompile: *processTimers internal/timers.js:460:25                                                                              |
| 69383 | 32.8%  | T _host_get_clock_service                                                                                                          |

The profiling is very similar, the only difference is the 1st and 2nd position
in the Bottom Up change, but still, these are the same 2 functions we saw in
development mode.

# Wait, but why?

Let’s dissect the two functions in C++ that are hoarding more than 75% of the
CPU.

**`T _host_get_clock_service`** This is a **SYSCALL** to the OS to get the
current time. **This is happening 32.8% of the time!!!**

**`MakeTypeError`** **MakeTypeError** is a C++ method that is called whenever an
error is thrown. If we look deeper into the log, we can see how this is related
to the **prometheus-plugin-heap-stats** module. This module tries to get the
current status of the memory heap at any given time.

In some way, both are related to the usage of Prometheus. So let's further
analyse the prometheus plugins.

# Prometheus: are the metrics making the metrics worse?

So, for the sake of testing, we are going to disable the metrics in development
and see if the performance and the profiling change.

| Project                   | Boot time | Hot Reload time |
| ------------------------- | --------- | --------------- |
| Fresh NextJS Installation | ~3 sec    | ~1.5 sec        |
| Metrics Enabled           | 1 - 2 min | 30 - 60 sec     |
| Metrics Disabled          | ~26 sec   | ~3.5 sec        |

**What about profiling?**

| Ticks | Total | nonlib | Name             |
| ----- | ----- | ------ | ---------------- |
| 17812 | 19.9% | 20.4%  | JavaScript       |
| 68056 | 76.1% | 78.0%  | C++              |
| 8419  | 9.4%  | 9.6%   | GC               |
| 2161  | 2.4%  | -      | Shared libraries |
| 1384  | 1.5%  | -      | Unaccounted      |

So the number of calls do change when we disabled prometheus for development.
Has the Bottom Up calls changed too?

| ticks | parent | name                                                                                                                                               |
| ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 56138 | 62.8%  | t __ZN2v88internalL60Builtin_Impl_Stats_CallSitePrototypeGetScriptNameOrSourceURLEiPmPNS0_7IsolateE                                                |
| 16130 | 28.7%  | t __ZN2v88internalL60Builtin_Impl_Stats_CallSitePrototypeGetScriptNameOrSourceURLEiPmPNS0_7IsolateE                                                |
| 2109  | 99.7%  | t __ZN2v88internalL60Builtin_Impl_Stats_CallSitePrototypeGetScriptNameOrSourceURLEiPmPNS0_7IsolateE                                                |
| 106   | 5.0%   | LazyCompile: *<anonymous> /Users/danilo.velazquez/dev/@kufar/kufar-fe/node_modules/webpack/node_modules/enhanced-resolve/lib/AppendPlugin.js:18:30 |
| 924   | 1.0%   | T _host_get_clock_service                                                                                                                          |

Now the most expensive call is one related to webpack and to resolution of
dependencies. Meanwhile, the **`T _host_get_clock_service`** have dropped from
being called more than 35% of the time to just 1%.

# Are we suffering from the Heisenberg principle?

Short answer: Yes. We knew that adding a **metrics plugin** will add to the
overall performance since it is running in the same machine and instance of
**NodeJS**.

## So, how do we solve it?

The installed version of **prom-client** is the **9.1.1** (released in
**2017**), and the current version is **12.0.0**. The installed version of
**prom-client** uses some (now legacy) API of NodeJS to get information and
metrics, and this is what is causing the performance problem. **Solution**:
update the prom-client library to one is close to the version of NodeJS in use
(in this case: v12). **After removing this library, the usage of C++ in the
profiler drops by ~10%**, which is enough to shorten the waiting times of
**NextJS** for compile, but is still high.

## Further optimisations can be made in order to get more performance, for example:

- **Removing the usage of babel in code rendered in NodeJS**, since most of
  those functions are now native to the platform, and they are just adding
  overhead to the V8 engine.
- **Avoid complex regex matchers in next.config.js**. A lot of the power process
  is being used to traverse the folders inside `node_modules`, and see if they
  match or don’t with the regex.
  - A solution is to duplicate the rules, but one to exclude and then, another
    to include the exceptions (this order is important)
  - Remove dependencies that are not being used
  - Remove not used dependencies
- Move **Cypress** to another repository (**Cypress** has a lot of dependencies)
- Analyse the difficulty of move code from **Koa** to **ExpressJS**, to in the
  future remove all the Koa dependencies and use **Express**, which is included
  in **NextJS**
