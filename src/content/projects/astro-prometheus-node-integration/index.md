---
title: "Astro Prometheus Node Integration: Add Prometheus Metrics to Astro"
description: "An Astro integration that exposes Prometheus metrics for your Astro site running with the Node.js adapter."
date: "October 26, 2025"
repoURL: "https://github.com/dvelasquez/astro-prometheus-integration/tree/main/packages/astro-prometheus-node-integration"
# demoURL: (No specific demo URL found in the provided files)
---

`astro-prometheus-node-integration` is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) designed to bring [Prometheus](https://prometheus.io/) monitoring to your Astro applications when using the `@astrojs/node` adapter. It automatically instruments HTTP requests, collects default Node.js metrics, and exposes them via a configurable endpoint for easy scraping and monitoring.

## Motivation

While Astro provides a great development experience, observability is crucial for production applications. Monitoring key metrics like request rates, durations, and server health helps ensure reliability and performance. This integration was created to provide a straightforward way to add industry-standard Prometheus metrics to Astro projects deployed with the Node.js adapter, filling a gap in the ecosystem for easy-to-implement monitoring. It aims to work out-of-the-box with sensible defaults while offering customization options.

## Key Features

- **Automatic HTTP Metrics:** Tracks request count (`http_requests_total`), request processing duration (`http_request_duration_seconds`), and full server response duration including streaming/TTLB (`http_server_duration_seconds`).
- **Default Node.js Metrics:** Collects standard Node.js metrics provided by `prom-client` (e.g., CPU usage, memory, garbage collection).
- **Configurable Endpoint:** Expose metrics at a custom URL path (default: `/metrics`).
- **Prometheus & OpenMetrics Support:** Choose the content type for the metrics endpoint.
- **Customization:** Apply global prefixes and labels to all metrics for easier identification in multi-service environments.
- **Standalone Metrics Server:** Option to expose metrics on a separate HTTP server/port instead of the main Astro application port.
- **Experimental Optimizations:** Includes an option (`useOptimizedTTLBMeasurement`) for high-concurrency scenarios to measure Time To Last Byte (TTLB) with minimal CPU overhead.

## Technology Stack

- **Astro:** The web framework.
- **Node.js:** Requires the `@astrojs/node` adapter.
- **TypeScript:** Language used for development.
- **prom-client:** The underlying library used for collecting and exposing Prometheus metrics.
- **astro-integration-kit:** Toolkit used for creating the Astro integration.

## Challenges

- **Performance Optimization:** Initial implementations faced performance bottlenecks due to computing metrics on every request. This required refactoring to cache metric instances during initialization, resulting in significant performance improvements (over 90% faster request processing in tests).
- **TTLB Measurement:** Accurately measuring Time To Last Byte (TTLB) for streaming responses required careful implementation, leading to both a high-accuracy (but higher CPU) stream-wrapping method and an optimized asynchronous timing method for high-concurrency needs.
- **Standalone Server Logic:** Ensuring the standalone metrics server works correctly in different Astro modes (dev, preview, build) required moving its initialization logic into the middleware.

## Lessons Learned

- **Caching is Crucial:** For middleware dealing with metrics or frequently accessed data, caching instances at initialization instead of computing/looking them up per-request is vital for performance and scalability.
- **Performance Tradeoffs:** Measuring metrics like TTLB can have different performance characteristics. Offering configurable strategies (like legacy vs. optimized TTLB) allows users to choose the best fit for their specific needs (accuracy vs. CPU overhead).
- **Integration Lifecycle:** Understanding Astro's build and runtime lifecycle is important for ensuring features like standalone servers or SDK initialization work correctly across different commands (`dev`, `build`, `preview`).

## Links

- **GitHub Repository:** [https://github.com/dvelasquez/astro-prometheus-integration/tree/main/packages/astro-prometheus-node-integration](https://github.com/dvelasquez/astro-prometheus-integration/tree/main/packages/astro-prometheus-node-integration)
- **NPM Package:** [https://www.npmjs.com/package/astro-prometheus-node-integration](https://www.npmjs.com/package/astro-prometheus-node-integration)

## Acknowledgements

- Thanks to the [Astro team](https://astro.build/) for the framework and integration capabilities.
- Built using the [astro-integration-kit](https://github.com/florian-lefebvre/astro-integration-kit).
- Relies heavily on the [prom-client](https://github.com/siimon/prom-client) library for Prometheus metrics collection.
