---
title: "Architecting for Resilience: When 150 RPS Becomes 2,000: Finding the Bottleneck"
description: "A deep dive into debugging a high-traffic Node.js crashloop. How we diagnosed a 'Fan-Out' architecture issue that amplified DDoS attacks against our own backend, threatening our availability."
date: "December 8, 2025"
keywords:
  ["resilience", "DDoS", "performance", "astro"]
featured: false
cta: "Is your platform ready for its next traffic spike?"
ctaLink: { "text": "Let's talk about it", "href": "/consulting" }
---

![A node exponentially fanning out (Generated with Gemini)](./fanout.png)

### Executive Summary

At **kleinanzeigen.de**, we moved our homepage to a modern Node.js stack. This helped us ship features faster, but it also exposed new stability risks. Recurring DDoS attacks were threatening our uptime. To keep the site online, we had to over-provision our infrastructure by 1000%.

This case study explains how I led the initiative to move from a "brute force" scaling strategy to a resilient architecture. We reduced infrastructure costs by **60%** and stopped the application from crashing during attacks, all while the team continued shipping new features.

---

### The Business Context: Surviving the Flood

Kleinanzeigen is the largest online marketplace in Germany. Our homepage is the front door to our ecosystem. It handles a baseline of around **150 requests per second (RPS)** and serves millions of users every day.

We had recently moved from a legacy Java monolith to an **Astro + Node.js** architecture. The launch went well, and performance was strong. But the reality of operating a high-visibility target caught up with us quickly.

We are a frequent target for DDoS attacks. It is important to understand the scale here—these are not small annoyances. We are talking about attacks generating **millions of requests per second** at the edge.

**The "Leak" Problem**
Our CDN and Firewall do an incredible job, filtering out the vast majority of this traffic. But when you are dealing with millions of RPS, even a tiny "leak" is devastating.

If an attack sends 10 million RPS and the firewall stops 99.9% of it, we are still left with **10,000 RPS** hitting our origin servers.

* **Normal Load:** 150 RPS.
* **Attack Leak:** 2,000 to 10,000 RPS.

We were facing traffic spikes that were **10x to 60x** our normal capacity, hitting us instantly. To make matters worse, the attacks were growing in volume over time. The brute-force method of adding more servers was becoming unsustainable. We couldn't just keep buying hardware to match the exponential growth of the attacks.

**The Operational Impact**
During these bursts, our new SSR (Server-Side Rendering) service would enter a "crashloop." Kubernetes liveness probes failed, pods restarted, and then crashed again immediately.

To keep the business running, our SRE team had to scale the deployment aggressively. We ran **100+ pods** (1 CPU / 2GB RAM) all the time. We were paying for 100 idle servers just to absorb a 2-minute spike once a week. We needed a structural solution.

### The Observability Gap: Finding the Root Cause

We could not stop the product roadmap to fix this. My role as a Staff Engineer was to protect the team's velocity by taking ownership of this stability issue. I had to analyze the problem and design a solution without blocking the daily feature work.

The first challenge was visibility. In the initial chaos, we assumed the CPU was struggling to render the React components. However, standard monitoring tools did not give us enough detail. In Node.js, a blocked Event Loop can often mask itself as low CPU usage while the server is actually unresponsive.

To fix the architecture, I first needed better data.

**Strategic Instrumentation**
I architected a custom observability layer to see exactly what was happening inside the runtime:

1.  **SSR Metrics:** I authored a custom Prometheus integration ([`astro-prometheus-node-integration`](https://www.npmjs.com/package/astro-prometheus-node-integration)) to measure raw HTTP server timings.
2.  **Dependency Tracing:** I implemented `observableFetch`, a wrapper around our internal API calls to track the latency of downstream services.

**The "Fan-Out" Discovery**
With the instrumentation in place, I worked with my coworkers to run load tests. The data showed us a critical flaw. It wasn't the CPU rendering that killed us. It was the **Fan-Out**.

For every single homepage request, our Node.js server made **20 concurrent API calls** to different backend microservices (User Service, Search, Recommendations, etc.).

* **Baseline:** At 150 RPS, we generated 3,000 internal RPS. The backend handled this easily.
* **Under Attack:** When traffic jumped to 2,000 RPS (a small leak), our application amplified this load. We were hammering our internal APIs with **40,000 RPS**.

We had built a DDoS amplifier. Our own application was choking our backend services and causing them to slow down. This increased the "wait time" for our Node.js processes, leading to memory saturation and cascading crashes.

### Looking Ahead: The Solution

I now had the evidence I needed. The problem was not just "traffic." It was an inefficient data-fetching strategy that did not scale well.

In **Part 2**, I will detail how we dismantled this fan-out architecture. I will explain the specific caching strategy we implemented to survive the flood and how we ultimately saved the company 60% in infrastructure costs—without sacrificing user experience.