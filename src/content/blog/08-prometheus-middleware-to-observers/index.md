---
title: "I've Re-Written My Metrics Middleware for Every Node Framework. Maybe I Didn't Have To"
description: "Learnings from instrumenting Prometheus in NodeJS applications and how it should be done in 2025+."
date: "November 16, 2025"
keywords:
  ["prometheus", "nodejs", "middleware", "observers", "performance", "astro"]
---

![Prometheus and NodeJS logos](/2025-11-16/nodejs-prometheus.png)

For the last 9 years, I've helped build and scale a half-dozen different marketplaces. And in almost every one, I've had to solve the same problem: getting good, basic RED metrics (Rate, Errors, Duration) out of the application.

My go-to playbook, for years, was to wire up a custom middleware. If the stack was Express, I'd start with something like this:

```javascript
// The "old way"
import client from "prom-client";

const requestHistogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

app.use((req, res, next) => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(startTime);
    requestHistogram.observe(
      { method: req.method, route: req.path, status_code: res.statusCode },
      duration[0] + duration[1] / 1e9
    );
  });

  next();
});
```

Here is a working example [written for Astro.](https://github.com/dvelasquez/node-perf/blob/main/prom-examples/astro/src/prometheus/middleware-implementation.ts)

This... worked! It was pragmatic. It got the job done.

And it wasn't just my idea. It was, for all intents and purposes, the "standard way." When I first needed to solve this, I found popular packages like `express-prometheus-middleware`. It worked. Later, I saw my friends at Subito.it in Italy solving the _same_ problem in their Next.js app... with a custom middleware.

The pattern was set in my head: this was how you did metrics.

But a pattern set in stone is just a wall you'll eventually run into. As I moved from project to project—new marketplaces, new teams—the stack was always different. That "standard" Express middleware was useless in **Next.js**, so I'd have to figure out how to wedge this logic into its API routes. Then I'd move to a **Fastify** project and learn its hook system (`onRequest`, `onResponse`) to do it all over again. Lately, I'm doing it in **Astro**.

I was dutifully porting the _exact same_ logic, over and over.

And in all those years of porting, I'd failed to notice that the platform itself had evolved underneath me. It made me finally ask the simpler question: What if I didn't have to do this at all?

### The Discovery: Node.js Is Already Watching

It turns out, since Node.js 16 (and maybe even earlier, though the docs are fuzzy), we've had the `PerformanceObserver` API. This is the same family of APIs we use in the browser to measure paint times and resource loading, but it's available on the server, too.

And it can listen to, among many other things, `'http'`.

This `http` type fires for events from the native `http.server` module. When a request comes in and when a response is finished, it creates a `PerformanceEntry` with all the timing data.

What does this mean? It means we can do this:

```javascript
/**
 * Use a performance observer instead of a middleware.
 * Observers are instrumented automatically by the Node.js runtime, so we don't need need to measure.
 */
export function startRequestObserver() {
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "http") {
        const httpEntry = entry;
        // record the duration of the request
        requestObserverDuration.observe(
          {
            method: httpEntry.detail.req.method,
            path: httpEntry.detail.req.url,
            status: httpEntry.detail.res.statusCode,
          },
          httpEntry.duration / 1000
        );
      }
    }
  });
  observer.observe({ entryTypes: ["http"] });
}
```

And just like that, it's done. No middleware, no framework hooks. As long as the tool you're using (Express, Next, Fastify, _whatever_) is built on the standard `http.server`, this observer will see the traffic. It's resilient.

But, as I was digging into this, I realized this solved _another_ problem that's been bugging me for years.

### Game-Changer #2: The End of `measurableFetch`

Knowing my _own_ server's response time is great. But in a modern, distributed world, my server is almost always a _client_ to five other services. If my API is slow, is it my code? Or is it the 500ms it's waiting on `some-third-party-api.com`?

This is the second half of the observability picture. And for about four years, I've been solving this with, you guessed it, another brittle pattern.

I'd create a wrapper function, something I'd call `measurableFetch` or `observableFetch`, and it would look something like this:

```javascript
// My old, brittle "solution"
import client from "prom-client";

const outgoingRequestHistogram = new client.Histogram({
  name: "http_outgoing_request_duration_seconds",
  help: "Duration of outgoing HTTP requests in seconds",
  labelNames: ["host", "method", "status_code"],
});

export async function measurableFetch(url, options = {}) {
  const { method = "GET" } = options;
  const host = new URL(url).host;
  const startTime = process.hrtime();
  let statusCode = "UNKNOWN";

  try {
    const response = await fetch(url, options);
    statusCode = response.status;
    return response;
  } catch (error) {
    statusCode = "ERROR";
    throw error;
  } finally {
    const duration = process.hrtime(startTime);
    outgoingRequestHistogram.observe(
      { host, method, status_code: statusCode },
      duration[0] + duration[1] / 1e9
    );
  }
}
```

Then, the "fun" part began: trying to remind everyone on the team, "Please, use `measurableFetch`! _Don't_ use the native `fetch`!"

It was a nightmare for code reviews. And it created three massive blind spots:

1.  **What if someone forgot?** A new team member (or just me, on a Friday) would use native `fetch`, and _poof_—that request was invisible to our dashboards.
2.  **What about `node_modules`?** What about that third-party SDK for analytics, or logging, or payments? They're making their own requests. We had zero visibility into them.
3.  **What about malicious requests?** What if one of our dependencies has been compromised?

This is where the _other_ entries from `PerformanceObserver` come in. Remember that `'resource'` type we saw earlier?

It turns out, `resource` entries are created for _all native `http.request` and `https.request` calls_.

This means if you're using native `fetch` (which is built on `http.request`), `node-fetch`, or even `axios`, Node.js is _already timing them for you_.

We just have to listen.

```javascript
import client from "prom-client";

const outgoingRequestHistogram = new client.Histogram({
  name: "http_outgoing_request_duration_seconds",
  help: "Duration of outgoing HTTP requests in seconds",
  labelNames: ["host", "path", "initiator", "status"],
});
export function startResourceObserver() {
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "resource") {
        const resourceEntry = entry;
        const url = new URL(resourceEntry.name);
        // record the duration of the resource
        resourceObserverDuration.observe(
          {
            host: url.host,
            path: url.pathname,
            initiator: resourceEntry.initiatorType,
            status: resourceEntry.responseStatus,
          },
          resourceEntry.duration / 1000
        );
      }
    }
  });
  observer.observe({ entryTypes: ["resource"] });
}
```

With this one observer, we're now capturing _all_ outgoing HTTP traffic.

- That `fetch` call someone forgot to wrap? **Got it.**
- That mysterious call from `some-third-party-sdk`? **Got it.**
- `axios`, `node-fetch`, native `fetch`? **Got it, got it, and got it.**

We've just replaced a fragile, high-maintenance wrapper function with a single, resilient, 20-line observer.

### So, What's the Catch?

As you can see in the code, this isn't _quite_ perfect.

The `PerformanceResourceTiming` entry (`resourceEntry` in our code) gives us `responseStatus` (the status code) and `duration` right on the top level. Fantastic.

But what's missing is the **HTTP method** ('GET', 'POST', etc.). The API simply doesn't expose it. This is the one small trade-off.

Also take note that the url is in the `name` property of the `resourceEntry`.

So, let's be pragmatic. Is it better to have:

- **Option A:** _Perfect_ metrics (method, status, duration) for the 70% of calls we remembered to wrap, and 0% visibility on the rest?
- **Option B:** _Almost perfect_ metrics (status, duration, host, but no method) for 100% of all outgoing calls?

I'm taking Option B every single time. It gives me the full picture.

### The "Hidden" Win: Staying Out of the Critical Path

There's one more advantage to this approach, and it's a big one: **performance.**

Your middleware, by definition, runs **in the critical path**. Think of it as a tollbooth: every single request must stop, be processed by your middleware's logic (even if it's just starting a timer), and _then_ get waved through. It's a serial, blocking step that adds latency, however small, to 100% of your requests.

The `PerformanceObserver` is more like a **traffic camera**. It's designed to be low-overhead. The Node.js runtime is _already_ generating these performance entries for its own internal use. Our observer simply gets a _copy_ of those events in a buffered, out-of-band way.

Our metrics-gathering code doesn't block the request. It runs parallel to it. The "tollbooth" is gone. This is not just a cleaner API; it's a fundamentally more performant and resilient design.

### The Takeaway

This was a long post, but the takeaway is simple: **our platforms are always evolving.**

The patterns we learned five years ago, even two years ago, might be obsolete. That [express-prometheus-middleware](https://www.npmjs.com/package/express-prometheus-middleware) package was a brilliant, pragmatic solution for the platform we _had_. But the platform we _have_ is more powerful.

Stop and take a look. The platform might have already solved your problem for you.

---

_(I'm wrapping this up and updating the [astro-prometheus-node-integration](https://www.npmjs.com/package/astro-prometheus-node-integration) package to use this new approach. Will share it here when it's ready...)_

You can find the code I used to capture the metrics in this [GitHub repository](https://github.com/dvelasquez/node-perf).
