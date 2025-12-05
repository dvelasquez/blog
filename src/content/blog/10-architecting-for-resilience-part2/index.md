---
title: "Architecting for Resilience: Stabilizing High-Traffic Node.js Workloads Under Attack (Part 2)"
date: "2025-12-05"
description: "Re-architected a Node.js service to survive targeted traffic spikes by adding a shared Redis cache, enforcing strict timeouts and circuit breakers, adopting Node clustering, and applying strategic degradation. Results: 80% lower CPU usage, 94% lower RAM usage, and monthly cost savings of €1,000 (from €1,700 to €700)."
tags:
  - resilience
  - nodejs
  - kubernetes
  - caching
  - undici
  - architecture
author: "dvelasquez"
draft: false
slug: "architecting-for-resilience-part2"
cover: "/images/blog/architecting-for-resilience-part2-cover.jpg"
# Add/adjust any site-specific keys here (series, reading_time, canonical, etc.)
---

# Architecting for Resilience: Stabilizing High-Traffic Node.js Workloads Under Attack (Part 2)

In Part 1, we identified the root cause of our instability: a "Fan-Out" architecture. A single user request triggered 20 internal API calls. This turned our own traffic into a weapon against our backe[...]  

Now, I will explain how we fixed it. We did not just patch a bug. We re-architected the system for resilience and efficiency.

### Decision 1: Shared State vs. Complexity

Our first move was to fix the volume of internal requests. We were using a basic in-memory cache. But because we had to scale to **100 pods** to survive the attacks, this cache was useless.

Kubernetes uses Round-Robin load balancing. This means a user’s requests were scattered across 100 different pods. We had 100 cold caches. The hit rate was near zero.

**The Architectural Pivot**  
I proposed introducing a shared **Redis** layer.

* **The Trade-off:** Adding Redis adds complexity. It is another piece of infrastructure to manage.
* **The Business Case:** The cost of managing Redis is nothing compared to the cost of 40,000 internal RPS hammering our backend services.

**The Result**  
We moved to a shared cache. This reduced outgoing API calls from **20 to 4 per request**. We successfully increased our throughput capacity by **400%**.


But even with this gain, we hit a hard ceiling. During the next load test, the CPU still spiked to 100%. The application still froze. We had solved the volume, but not the behavior.

### Decision 2: The "Undici Trap" & The Event Loop Jam

This phase uncovered a dangerous behavior in the Node.js ecosystem.

**The Technical Deep Dive**  
We discovered a critical issue with **Undici** (Node.js’s native `fetch` implementation).

In most browsers and standard Node.js configurations, HTTP requests have a default timeout of around **300 seconds (5 minutes)**. However, Undici does not set a default timeout. It will wait indefinit[...]  

**The Failure Mode**  
During an attack, our downstream APIs are under heavy load. They slow down. A response that usually takes 10ms might take 10 seconds or longer.

1.  **The Queue:** Node.js processes keep connections open, waiting for data. Thousands of requests sit pending in the Event Loop's queue.
2.  **The Thundering Herd:** When these connections finally resolve (or hit the 5-minute system limit), they all hit the main thread at the same time.
3.  **The Processing Spike:** The single thread has to process thousands of errors *and* try to render the HTML for the requests that were waiting.

**The "Death by Processing"**


This massive burst of CPU activity locks the Event Loop completely. While the loop is busy clearing this backlog, Kubernetes pings the `/healthz` endpoint. Node.js is too busy to answer. Kubernetes ma[...]  

We were not crashing because of code errors. We were crashing because we allowed our backlog to grow larger than our CPU could handle.

### Engineering Resilience: The Solution

To survive, we changed our strategy. We stopped trying to serve every request perfectly. We focused on protecting the platform.

**1. Aggressive Circuit Breaking & Timeouts**  
We stopped being polite to our dependencies. We wrapped our external calls in circuit breakers and enforced strict timeouts. If a downstream service hangs, we cut the connection early. This prevents t[...]  


**2. Strategic Degradation (Business Continuity)**  
I aligned with Product and UX to define "Good Enough."

* *Scenario:* The Authentication Service is failing under load.  
* *Old Behavior:* 500 Error. Page Crash.  
* *New Behavior:* We default to the "Anonymous" cached version of the page.  
* *Value:* The user still sees the content. The site stays up.

**3. Vertical Scaling & Clustering**  
We fundamentally changed how we deploy. Running 100 small pods was inefficient. We wasted resources on 100 separate Node.js runtimes and OS overhead.

We shifted to a **Vertical Scaling** model using Node.js Clustering:

* **Architecture:** We consolidated into larger pods. Each pod runs **10 concurrent processes**.  
* **Load Balancing:** This allows us to use a **Least Connections** strategy internally. Traffic is routed to the worker process that is free, rather than blindly sending requests to a busy worker.

### The Business Impact: Radical Efficiency

These changes transformed our operations. We moved from a defensive, massive infrastructure to a lean and resilient one.

**Resource Consolidation (The Comparison)**

* **Before (The "Panic" Scale):**  
    * 100 Pods (1 vCPU / 2GB RAM each)  
    * **Total Resources:** 100 vCPUs / 200 GB RAM  
    * *Status:* Unstable, Expensive.

* **After (The "Resilient" Scale):**  
    * 2 Pods (10 vCPUs / 6GB RAM each)  
    * **Total Resources:** 20 vCPUs / 12 GB RAM  
    * *Status:* Stable, Cost-Effective.

**The ROI**  
We achieved an **80% reduction in CPU** and **94% reduction in RAM** allocation.

* **Cost Reduction:** Monthly infrastructure spend dropped from **€1,700 to €700**.  
* **Stability:** In subsequent attacks (leaking 6,000 RPS), the system did not crash. It degraded gracefully by tripping circuit breakers.

### Conclusion

At **kleinanzeigen.de**, we learned that stability at scale is not about writing faster code. It is about managing dependency and resource efficiency.

We assumed that downstream services *will* fail. We optimized our Node.js runtime to handle that pressure without locking up. By doing this, we turned a weekly crisis into a managed background event.

Reliability is not an accident. It is an arch
itectural feature.