---
title: "Architecting for Resilience: The Efficiency Fix: Saving €1,000/Month Through Architecture (Part 2)"
description: "Moving from brute-force scaling to resilient engineering. How we implemented Redis, Circuit Breakers, and Node.js Clustering to stabilize the platform and reduce infrastructure costs by 60%."
date: "December 9, 2025"
tags:
  - resilience
  - nodejs
  - kubernetes
  - caching
  - undici
  - architecture
slug: "architecting-for-resilience-part2"
cover: "/images/blog/architecting-for-resilience-part2-cover.jpg"
featured: true
cta: "Cut infrastructure costs without sacrificing stability."
ctaLink: { "text": "Let's talk", "href": "/consulting" }
---
![A node exponentially fanning out (Generated with Gemini)](./pods.png)

[In Part 1](../09-architecting-for-resilience/index.md), we identified the root cause of our instability: a "Fan-Out" architecture. A single user request triggered 20 internal API calls, turning our own traffic into a weapon against our backend.

Now, I will explain how we fixed it. We did not merely patch a bug; we re-architected the system for resilience and efficiency.

### Decision 1: Shared State vs. Complexity

Our first move was to fix the volume of internal requests. We were using a basic in-memory cache, but because we had to scale to **100 pods** to survive the attacks, this cache was ineffective.

Kubernetes uses Round-Robin load balancing. This meant a user’s requests were scattered across 100 different pods. We had 100 cold caches, resulting in a hit rate near zero.

**The Architectural Pivot**
I championed the introduction of a shared **Redis** layer.

* **The Trade-off:** Introducing Redis adds complexity—it is another piece of infrastructure to manage.
* **The Business Case:** The operational overhead of Redis was negligible compared to the cost of 40,000 internal RPS hammering our backend services.

**The Result**
Moving to a shared cache reduced outgoing API calls from **20 to 4 per request**. We successfully increased our throughput capacity by **400%**.

However, even with this gain, we hit a hard ceiling. During the next load test, the CPU still spiked to 100%, and the application froze. We had solved the volume, but not the behavior.

### Decision 2: The "Undici Trap" & The Event Loop Jam

This phase uncovered a dangerous behavior in the Node.js ecosystem.

**The Technical Deep Dive**
We discovered a critical configuration issue with **Undici** (Node.js’s native `fetch` implementation).

In most browsers and standard Node.js configurations, HTTP requests have a default timeout of around **300 seconds (5 minutes)**. However, Undici does not enforce a default timeout by default. It will wait indefinitely.

**The Failure Mode**
During an attack, our downstream APIs are under heavy load and slow down. A response that usually takes 10ms might take 10 seconds or longer.

1.  **The Queue:** Node.js processes keep connections open, waiting for data. Thousands of requests sit pending in the Event Loop's queue.
2.  **The Thundering Herd:** When these connections finally resolve (or hit the system limit), they all flood the main thread simultaneously.
3.  **The Processing Spike:** The single thread must process thousands of errors *and* attempt to render HTML for the waiting requests.

**"Death by Processing"**
This massive burst of CPU activity locks the Event Loop completely. While the loop is busy clearing this backlog, Kubernetes pings the `/healthz` endpoint. Because Node.js is too busy to answer, Kubernetes marks the pod as unhealthy and kills it.

We were not crashing because of code errors. We were crashing because we allowed our backlog to grow larger than our CPU could handle.

### Engineering Resilience: The Solution

To survive, we changed our strategy. We stopped trying to serve every request perfectly and focused on protecting the platform's integrity.

**1. Aggressive Circuit Breaking & Timeouts**
We abandoned passive error handling. We wrapped our external calls in circuit breakers and enforced strict timeouts. If a downstream service hangs, we cut the connection early. This prevents the Event Loop queue from becoming unmanageable.

**2. Strategic Degradation (Business Continuity)**
I aligned with Product and UX to define "Good Enough" during failure states.

* *Scenario:* The Authentication Service is failing under load.
* *Old Behavior:* 500 Error. Page Crash.
* *New Behavior:* We default to the "Anonymous" cached version of the page.
* *Value:* The user still sees content, and the site remains available.

**3. Vertical Scaling & Clustering**
We fundamentally changed our deployment strategy. Running 100 small pods was inefficient; we were wasting resources on 100 separate Node.js runtimes and OS overhead.

We shifted to a **Vertical Scaling** model using Node.js Clustering:

* **Architecture:** We consolidated into larger pods. Each pod runs **10 concurrent processes**.
* **Load Balancing:** This allows us to use a **Least Connections** strategy internally. Traffic is routed to the worker process that is free, rather than blindly sending requests to a busy worker.

### The Business Impact: Radical Efficiency

These changes transformed our operations. We moved from a defensive, over-provisioned infrastructure to a lean, resilient one.

**Resource Consolidation (The Comparison)**

* **Before (The "Reactive" Scale):**
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

At **kleinanzeigen.de**, we learned that stability at scale is not just about writing faster code. It is about managing dependency and resource efficiency.

We assumed that downstream services *will* fail. We optimized our Node.js runtime to handle that pressure without locking up. By doing this, we turned a weekly crisis into a managed background event.

Reliability is not an accident. It is an architectural feature.