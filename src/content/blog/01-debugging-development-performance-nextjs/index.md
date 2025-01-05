---
title: Debugging Development Performance in a NextJS Application
date: "April 19, 2020"
description: "Analysis, diagnostic, and fix of a performance problem in a NextJS Application."
---

#  Next.js Development Got You Down? Speed it Up!

One of the coolest parts of my job is getting to work on some seriously popular websites—we're talking top 10 in their countries! It's a real privilege to help improve platforms that so many people rely on.

Often, the teams I work with are busy adding new features and keeping the business side of things running smoothly. That doesn't leave much time for digging into technical performance. And that's where I come in.

Recently, I teamed up with a group to troubleshoot their Next.js app, which was running painfully slow in development mode. Let me break down how we tracked down the issue and got things back up to speed.

#  The Problem: Development Mode Was a Slug

This Next.js app was way slower than other projects with a similar setup.  

Just take a look:

| Project                       | Boot Time | Hot Reload Time |
|--------------------------------|-----------|-----------------|
| Fresh NextJS Installation      | ~3 sec    | ~1.5 sec        |
| Marketplace (Tunisia/Dominican)| ~15 sec   | ~5 sec          |
| **Marketplace (Belarus)**      | 1-2 min   | 30-60 sec       |

The Belarusian site was lagging **4X - 8X** behind! Time to put on our detective hats.

#  The Tools: Node.js Profiling to the Rescue

Since the problem seemed to be with how Node.js was compiling, building, or running the code, we used Node.js's built-in profiling tools.  

We ran the app with the `--prof` command to create a profiling file. This gave us a peek into what was happening inside the V8 engine.

**What we found:** The app was spending way too much time in C++ code instead of JavaScript, especially in functions that got the current date (`_host_get_clock_service`) and functions related to  `prometheus-plugin-heap-stats`.


#  The Root Cause:  Prometheus (and an Old Library)

The profiling data pointed us toward Prometheus. To be sure, we switched off the Prometheus metrics in development mode, and voilà—a huge improvement:

| Project                       | Boot Time | Hot Reload Time |
|--------------------------------|-----------|-----------------|
| Fresh NextJS Installation      | ~3 sec    | ~1.5 sec        |
| Metrics Enabled               | 1-2 min   | 30-60 sec       |
| **Metrics Disabled**           | ~26 sec   | ~3.5 sec        |

**But why was Prometheus causing such a slowdown?**

The project was using a really old version of `prom-client` (9.1.1, released way back in 2017!). This outdated version used old Node.js code, which was causing the performance issues.

**The Fix:** We updated `prom-client` to the newest version (12.0.0 at the time), and that significantly cut down on C++ usage and sped up development.

#  More Speed Boosts:  Extra Optimizations

Updating the library was a big win, but we weren't done yet! Here are some more tweaks we made:

* **Ditch the Extra Babel:** We got rid of Babel transpilation for the server-side code, since modern Node.js can handle most of what Babel does on its own. This helped the V8 engine run more smoothly.
* **Simplify `next.config.js`:** We cleaned up the complicated rules in the `next.config.js` file to make dependency resolution faster.
    *  **Pro Tip:** Use separate rules for including and excluding things to avoid those resource-heavy regex operations.
* **Dependency Cleanup:**  We removed any dependencies the project wasn't using to slim things down.
* **Consider Moving Cypress:**  For bigger projects, moving Cypress tests to their own repository can really help development speed.
* **Koa or Express?:**  We thought about switching from Koa to Express.js (which is built into Next.js) to maybe simplify things and get rid of some dependencies.

**By making these optimizations, we made a real difference for the team. They could focus on building awesome features without getting bogged down by slow performance.**

Hopefully, this look into debugging Next.js performance helps you out! Remember, profiling tools and a step-by-step approach can help you find and fix those hidden performance problems.