---
title: "Why Kleinanzeigen.de Picked Astro Over Next.js"
description: "Our journey modernizing Germany's largest classifieds site, evaluating Next.js, Deno/Fresh, and Astro, and why Astro's islands were the right choice for our scale and challenges."
date: "April 23, 2025"
featured: true
cta: "Need help evaluating a migration from Next.js or Legacy stacks? I offer architectural audits."
ctaLink: { "text": "Get in touch", "href": "/consulting" }
---

![A person on a bifurcation thinking which way to take](/2025-04-23/header-decision-path.jpg)

It's a funny thing, working at a company that feels like it's going through **adolescence**. [Kleinanzeigen](https://www.kleinanzeigen.de/), formerly eBay Kleinanzeigen, has been around for about **16 years**. It started like many startups, with just a handful of people – my own manager was one of the first ten hires. Fast forward through an acquisition by Adevinta about four years ago, and another one more recently by a Private Equity firm, and suddenly we're pushing **500 employees** and still growing fast. We're not that small startup anymore, but we're definitely not a slow-moving corporate giant either. We're in transition, and that means change. Lots of it.

This new chapter kicked off around mid-2024 when a major project I was involved in got cancelled. That project aimed to unify several international marketplaces onto a single, massive Next.js platform – yes, the very same one I wrote about in the ["Taming the CI Beast" series](https://d13z.dev/blog/03-taming-the-ci-beast/). While that experience taught us valuable lessons about the challenges of large Next.js apps, the new ownership decided the path forward was to focus on growing each marketplace individually and sold them – the classic **Private Equity playbook**.

So, back I came to focus solely on Kleinanzeigen, Germany's largest classifieds site. The mandate was clear: **grow, grow, grow**. Our new owners needed a **"Value Creation Plan,"** mapping out significant evolution for the platform over the coming years. This meant fundamental changes to the product, touching every part of the user experience... and colliding head-on with our existing tech stack.

## The Existing Landscape: A Monolith Whispering "Don't Touch Me"

![A haunted forest, full of fear and uknowns](/2025-04-23/haunted-forest.jpg)

So, what were we dealing with? The core of Kleinanzeigen is a battle-tested (perhaps battle-scarred?) **Java Springboot** application, heavily reliant on JSPs, Moustache templates, and a whole lot of **jQuery** and vanilla JavaScript. Over the years, new features were often built as separate services or widgets – we counted around **50 microfrontends** built with Preact and TypeScript embedded here and there – but the main user journeys (homepage, search results, item details pages) lived deep within this Java monolith.

For us web engineers, this meant pain. Want to change something small on the homepage? Prepare to dive into the Java pipeline, tweak some JSPs, wrestle with jQuery, submit a PR, and then wait... and wait... for your turn to release. Depending on the day, getting even a minor change live could take anywhere from **an hour** (if you were lucky) to **an entire day**. Found a bug? Fixing it and rolling out the correction took at least **another hour**. This glacial pace just wasn't cutting it for a business needing to move fast. Any change, no matter how small, faced significant delays, directly impacting our **time-to-market**.

The developer experience wasn't much better. The sheer size and constant churn on the Java app meant local development environments were notoriously fragile. Setting up often involved reinstalling dependencies, debugging obscure configuration issues, asking for help on Slack, and recompiling the beast again and again. Frontend web developers ended up using tools they weren't necessarily comfortable with, like **Maven** instead of the more familiar **npm**, adding cognitive load.

This friction created what we started calling the [**"haunted forest" problem**](https://increment.com/software-architecture/exit-the-haunted-forest/). Teams, understandably, began avoiding making changes to the core platform whenever possible, preferring to build yet another isolated widget on the side. This impacted morale and meant both product and engineering were constantly seeking workarounds rather than improving the core experience. To make matters worse, the core platform had seen few updates during the year-and-a-half spent on the now-cancelled unification project, meaning we had technical debt _and_ a backlog of needed changes.

Something had to give. We couldn't be afraid to touch our most critical pages. We needed modern tools, a faster development cycle, and a way to empower our teams to deliver value quickly. The need for a fundamental shift in our frontend technology was undeniable.

## The Search for a Modern Frontend Solution

The goal was clear: evolve the entire platform. New features, new user flows, significant changes affecting _all_ pages, especially the core ones we'd been avoiding. This required a technology stack that could handle rapid iteration, felt familiar to modern web developers, and wouldn't buckle under our scale.

Our key constraints were to leverage existing team skills where possible – primarily **React/Preact** and **TypeScript** – while significantly improving developer experience and performance. We also needed excellent support for **self-hosting**, as our traffic levels (hundreds of millions of pageviews daily) made relying solely on platforms like [Vercel](https://vercel.com/) cost prohibitive.

This led us to evaluate three main contenders.

## Evaluating the Options: PoCs and Trade-offs

The platform team set up a simple demo application featuring a homepage, search results page, and item details page, crucially integrating one of our existing complex Preact widgets – the GDPR banner – to test compatibility.

### 1. Next.js

<img src="/2025-04-23/nextjs-logo.png" width="180" alt="NextJS github logo" />

- **The Familiar Choice:** Having just spent a year and a half working on the (cancelled) [Next.js](https://nextjs.org/) unification project, our team had significant hands-on experience. We knew its strengths: a massive community, great React/Preact support, and flexibility with CSS solutions. We could integrate our GDPR banner without issue in the demo app.
- **The Pain Points:** But that familiarity cut both ways. We'd directly experienced the struggles of managing a _large_ Next.js application, as documented in ["Taming the CI Beast"](https://d13z.dev/blog/03-taming-the-ci-beast/). Upgrades (React 17->18, Next 13->14->15) were **long and painful**. More critically, [Vercel's business model doesn't incentivize robust, easy self-hosting](https://eduardoboucas.com/posts/2025-03-25-you-should-know-this-before-choosing-nextjs/); it felt like an **afterthought**, leading to complex customizations on our side that broke during upgrades.
- **Performance Concerns:** Keeping performance high was a constant battle, especially with the numerous third-party marketing, analytics, and advertising scripts essential to our business. The standard SSR -> Hydration -> Reconciliation model often led to layout repainting and poor Core Web Vitals as third parties manipulated the DOM before or during hydration. [React Server Components (RSCs)](https://react.dev/reference/rsc/server-components) were emerging, but at the time, they felt like a complex workaround rather than a fundamental solution for our need: sending **_as little JavaScript as possible_** to the user for our content-heavy, SEO-critical pages. Next.js felt like a generalist framework, good for many things, but not optimized for our specific, high-traffic, mostly static content use case.

### 2. Deno / Fresh

<img src="/2025-04-23/fresh-logo.svg" width="180" alt="Fresh logo" />

- **The Clean Slate:** [Fresh](https://fresh.deno.dev/) offered an intriguing paradigm: [Preact](https://preactjs.com/) components everywhere, SSR by default, and the unified [Deno](https://deno.com/) runtime. This aligned well with our philosophy, as much of our content doesn't require client-side interactivity. We built the demo successfully, integrated the GDPR banner, and appreciated the developer experience. It ticked most boxes, including [TailwindCSS](https://tailwindcss.com/) support (a requirement for our new design system).
- **The Risks:** However, Deno's community is **significantly smaller** than Node.js's. Fresh, while promising, was very new. Opting for Deno would also require a more extensive internal architecture approval process. While technically viable, the perceived maturity and community support tilted the scales towards Node.js-based solutions for safety.

### 3. Astro

<img src="/2025-04-23/astro-logo.png" width="180" alt="Astro logo" />

- **The Challenger:** Proposed by a staff engineer, [Astro](https://astro.build/) shared Fresh's philosophy of minimizing client-side JavaScript but took it further with its explicit focus on the [**Island Architecture**](https://www.patterns.dev/vanilla/islands-architecture/). This immediately resonated – our pages are large islands of static content with small, isolated areas needing interactivity. We built the demo, integrated the GDPR banner (though noting the server-side styled-jsx limitation), and found it ticked all functional boxes.
- **The Strengths:**
  - **_Islands Architecture:_** Send HTML by default, only hydrating specific components (`<client:load>`, `<client:visible>`, etc.). This directly addressed our performance issues with Next.js hydration and third-party script interference. **Less JS meant faster loads and fewer reconciliation problems.**
  - **_UI Framework Agnostic:_** Out-of-the-box support for React, Preact, Vue, Solid, Svelte etc., offered flexibility and future-proofing.
  - **_Maturity & Self-Hosting:_** A vibrant community, stable versioning history (at the time), and **first-class support** for self-hosted Node.js deployments.
- **The Considerations:**
  - _Learning Curve:_ `.astro` file syntax, with its frontmatter and JSX-like-but-not-quite templating, required adjustment. Distinguishing Astro components from framework components (like Preact) took some time getting used to.
  - _Tooling:_ Astro builds on [Vite](https://vite.dev/) and [Vitest](https://vitest.dev/). Our team primarily had experience with Webpack and Jest, meaning the platform team would need to support a new toolchain.
  - _Styled-JSX Limitation:_ Astro couldn't server-render components using [styled-jsx](https://github.com/vercel/styled-jsx), meaning our existing widgets would render client-side until migrated to TailwindCSS.

## The Decision and Rollout: Embracing the Islands

![A diagram showing an example of the islands architecture](/2025-04-23/islands-architecture.png)

After the platform team's initial demos and evaluations, we documented our findings in an **Architectural Decision Record (ADR)** and opened it as an RFC for four weeks, gathering feedback from the entire web engineering **Community of Practice (CoP)**.

While Next.js was familiar and Fresh was innovative, **Astro's Island Architecture seemed purpose-built for our specific challenges**: large, mostly static pages needing high SEO performance, plagued by third-party script interference, and requiring minimal client-side JavaScript. The framework flexibility and strong self-hosting support sealed the deal.

To ensure buy-in and smooth adoption, we held workshops introducing Astro to interested engineers. We then partnered with the team responsible for the Kleinanzeigen Homepage to rebuild it using Astro as a Proof of Concept. This new homepage was gradually rolled out to **1%**, then **10%**, **40%** and then to **100%**, validating the approach in production.

## Implementation: A Multi-App, Shared Component Architecture

![A diagram comparing the monolith vs multi app architecture](/2025-04-23/diagram-architectures.jpg)

Learning from the pains of monoliths (both Java and the potential Next.js one), we made a key architectural decision: **no single giant Astro application**. Instead, each major business domain (Homepage, Search, Item Details, etc.) would own its **separate Astro application**.

- **Team Autonomy:** This allows teams to develop and release features independently, without getting blocked by other teams' release cycles.
- **Platform Support:** This shifts more responsibility onto the platform team (us!) to manage multiple applications, ensure consistency, and provide robust tooling. We set up a frontend monorepo using [Lerna-Lite](https://github.com/lerna-lite/lerna-lite), [Turborepo](https://turbo.build/), and npm workspaces to manage shared libraries.
- **Shared Libraries:** Common elements like the site header and footer are built as versioned packages within the monorepo. Applications consume these libraries, and [RenovateBot](https://docs.renovatebot.com/) automatically creates PRs to update dependencies, keeping things aligned. We're actively building tooling to monitor dependency versions and adoption across all applications.
- **SSR & Preact:** We opted for Server-Side Rendering (SSR) using Astro's [Node.js adapter](https://docs.astro.build/en/guides/integrations-guide/node/). While SSG might be suitable for some pages later, generating pages for our [**50+ million active ads**](https://adevinta.com/brand/kleinanzeigen/) at build time is currently impractical. We chose **Preact** as our primary UI framework, leveraging existing team experience with it in widgets and valuing its smaller bundle size.
- **TailwindCSS:** Stemming from positive experiences during the unification project and the need to migrate away from styled-jsx (due to SSR limitations in Astro and testing difficulties), we fully embraced **TailwindCSS**, integrating it into our new design system.

## Results and Developer Feedback: Early Wins and Lessons

So, how has it gone so far?

- **Developer Experience:** The feedback has been overwhelmingly positive.
  - Onboarding time for the new Astro homepage project dropped from potentially days for the Java monolith to **less than 15 minutes**.
  - The CI/CD pipeline is drastically faster. Linting and unit tests take **~1.5 minutes**, E2E tests **~2 minutes**, and a full build and deployment finishes in about **5 minutes**. This compares to roughly 15 minutes just for a non-production deployment and **over an hour** for a full production release cycle with the old Java system. This speed is crucial for enabling faster iteration.
  - Developers appreciate the modern tooling (Node, npm, Vite) and the clearer structure. Quotes include:
    - _"Very smooth and easy to use."_
    - _"Great! It is easy to install and run, documentation is also very good."_
    - _"very easy to learn coming from react with next.js experience"_
    - _"Nice and modern."_
- **Performance:** We've seen modest but positive improvements. The old Java homepage had a Lighthouse score around **64/100**; the new Astro version sits around **69/100** _before_ any targeted performance optimization work. There's clear potential for further gains now that we're shipping less JavaScript by default.
<div style="display: flex; gap: 1rem; align-items: center;">
  <img src="/2025-04-23/ka-java-performance.png" alt="Lighthouse performance scores for the java application, 64/100" width="400" />
  <img src="/2025-04-23/ka-astro-performance.png" alt="Lighthouse performance scores for the astro application, 64/100" width="400" />
</div>

- **Widget Reuse:** Integrating existing Preact widgets was generally straightforward, as they often just need an HTML element to mount into. However, we face challenges with multiple widgets potentially loading their own Preact versions on the same page, something we hope to optimize later.

## Challenges and Learning Curves

It hasn't all been seamless, of course.

- **Learning Astro:** While generally positive, some developers found Astro's concepts (like `defineAction()`) and the `.astro` syntax slightly confusing initially compared to pure JSX. Having internal expertise available was crucial during the early phases. One developer new to the Node ecosystem found the v5 upgrade "a bit of a rocky road," though this was more related to their learning process, as the upgrade itself was quick for the platform team.
- **Testing:** Migrating widgets away from styled-jsx is necessary partly because testing Preact components using it with Vitest and `@testing-library/preact` proved problematic. This accelerated our adoption of Tailwind.
- **Long-Term Maintenance:** Some developers expressed minor concerns about the longevity of Astro's concepts or the potential for future breaking changes. The platform team plans to proactively manage framework upgrades to mitigate this.
- **Server Features:** One developer noted that built-in support for production server needs like monitoring and logging felt less mature than desired, requiring custom setup.
- **Multi-App Coordination:** Ensuring consistency and managing updates across multiple independent applications requires ongoing effort and robust automation from the platform team.

## Conclusion: The Right Tool for the Job

![The conclusion: Astro.](/2025-04-23/conclusion-astro-logo.png)

Choosing a foundational technology for a platform supporting Germany's largest classifieds site wasn't a decision taken lightly. While Next.js offers a powerful and popular ecosystem, our specific challenges with scale, self-hosting, legacy integration, third-party scripts, and the critical need to minimize client-side JavaScript led us to Astro.

Astro's Island Architecture provided a philosophical and practical fit for our content-heavy pages, directly addressing the performance bottlenecks we anticipated and had experienced previously. The improved developer experience, significantly faster CI/CD pipeline, and framework flexibility have empowered our teams to move faster and tackle the ambitious goals set by our Value Creation Plan.

The journey is ongoing. We have optimizations to make, testing strategies to refine, and the complexities of a multi-app architecture to manage. But the initial results are promising, and the shift to Astro feels like the right strategic move for Kleinanzeigen's next phase of growth.

I'm very grateful of having the opportunity to work on this evaluation and be able to contribute to Kleinanzeigen future platform.

### So, When Might Astro Be Right For You?

Based on our experience, Astro shines particularly bright if:

- Your site is **content-heavy**, with large portions being static HTML.
- Your site is not a highly reactive application with real time features.
- You need **fine-grained control** over _which_ parts of your UI are interactive to optimize performance (Island Architecture).
- **Minimizing client-side JavaScript** is a high priority for Core Web Vitals or user experience.
- You need excellent **self-hosting support** and aren't tied to a specific deployment platform.
- You value the flexibility to **mix and match different UI frameworks** (React, Preact, Vue, etc.) within the same project.
- You're facing performance challenges related to **hydration and third-party script interference** in complex SSR applications.
- You're tired of NextJS.

If these points resonate, Astro is definitely worth evaluating for your next project.
