export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "What is your professional summary as a Staff Software Engineer?",
    answer: `<p>I am a <strong>Staff Software Engineer based in Barcelona, Spain</strong>. I specialize in designing and building for <strong>high-traffic web platforms</strong>. For the past seven years, my expertise has been focused on working on some of the most visited websites in Europe and South America, including <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a> (France), <a href="https://www.kleinanzeigen.de" target="_blank" rel="noopener noreferrer"><strong>kleinanzeigen.de</strong></a> (Germany), <a href="https://www.subito.it" target="_blank" rel="noopener noreferrer"><strong>subito.it</strong></a> (Italy), <a href="https://www.willhaben.at" target="_blank" rel="noopener noreferrer"><strong>willhaben.at</strong></a> (Austria), <a href="https://www.jofogas.hu" target="_blank" rel="noopener noreferrer"><strong>jofogas.hu</strong></a> (Hungary), and <a href="https://www.yapo.cl" target="_blank" rel="noopener noreferrer"><strong>yapo.cl</strong></a> (Chile).</p><p>My core focus is on <strong>system architecture</strong>, <strong>platform engineering</strong>, <strong>application performance</strong>, and improving <strong>developer experience (DevEx)</strong> at scale.</p>`,
  },
  {
    question:
      "As a Staff Engineer, how do you multiply your impact beyond your own code?",
    answer:
      '<p>My role is to make every developer around me more effective. I do this by focusing on three areas:</p><ol><li><strong>Mentoring & Knowledge Sharing:</strong> I actively teach and mentor other engineers, create comprehensive onboarding documentation, and contribute to internal guilds to share knowledge across the organization.</li><li><strong>Cross-Team Alignment:</strong> I act as a technical liaison between international teams (e.g., in Italy, Hungary, Mexico, Austria), helping to spread best practices and shape our global community.</li><li><strong>Building Leverage:</strong> I build tools and platforms that solve problems for <em>everyone</em>. This includes creating a custom tool (<code>node-ftl</code>) to streamline email development, setting up the E2E testing architecture at <a href="https://www.jofogas.hu" target="_blank" rel="noopener noreferrer"><strong>Jofogás</strong></a> to reduce test times by 75%, or leading the CI/CD migration at <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a> which cut pipeline times from over an hour to less than 10 minutes.</li></ol>',
  },
  {
    question:
      "You talk about performance and DevEx. Can you provide specific examples of your impact at these marketplaces?",
    answer: `<p>Absolutely. My role is to drive measurable improvements. Here are a few key examples:</p><ul><li><strong>Developer Velocity:</strong> At <a href="https://www.kleinanzeigen.de" target="_blank" rel="noopener noreferrer"><strong>Kleinanzeigen</strong></a>, I helped achieve an <strong>83.3% reduction in Mean Lead Time for Changes (MLTC)</strong>. This was on the critical parts of the application that we successfully migrated from a legacy Java system to a modern stack using <a href="https://astro.build/" target="_blank" rel="noopener noreferrer"><strong>Astro</strong></a> and <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"><strong>Node.js</strong></a>.</li><li><strong>Application Performance (Global Markets):</strong> As a Technical Lead, I built the infrastructure to track Page Speed (using <a href="https://developer.chrome.com/docs/lighthouse/overview/" target="_blank" rel="noopener noreferrer"><strong>Lighthouse</strong></a>, <a href="https://prometheus.io/" target="_blank" rel="noopener noreferrer"><strong>Prometheus</strong></a>, and <a href="https://grafana.com/" target="_blank" rel="noopener noreferrer"><strong>Grafana</strong></a>) which enabled us to:<ul><li>Help <a href="https://www.subito.it" target="_blank" rel="noopener noreferrer"><strong>Subito</strong></a> (Italy) <strong>improve its performance score from 27/100 to 53/100</strong> and <strong>reduce its Time to Interactive from ~30 seconds down to ~7 seconds</strong>.</li><li>Help <a href="https://www.willhaben.at" target="_blank" rel="noopener noreferrer"><strong>Willhaben</strong></a> (Austria) improve its performance score from 35/100 to 59/100.</li><li>Help <a href="https://www.jofogas.hu" target="_blank" rel="noopener noreferrer"><strong>Jofogás</strong></a> (Hungary) improve its First Contentful Paint from ~12 seconds to 3.9 seconds.</li></ul></li></ul>`,
  },
  {
    question:
      "What is your direct experience with CI/CD and platform engineering?",
    answer: `<p>My primary focus is building the "golden path" for developers. My biggest achievement in this area was at <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a>, France's largest marketplace.</p><p>I led the <strong>CI/CD migration from Travis CI to <a href="https://github.com/features/actions" target="_blank" rel="noopener noreferrer">GitHub Actions</a></strong> for the main, front-facing web application. This project <strong>reduced our CI pipeline time from 1-2 hours down to less than 10 minutes</strong>.</p><p>This migration also included further optimizations on the <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a> platform that resulted in a <strong>93.3% reduction in testing time</strong>, an 80% reduction in linting time, and a 64% reduction in app build time.</p><p>Separately, at <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>Leboncoin</strong></a>, I also led a platform optimization that <strong>reduced our production pod count from ~500 to ~150</strong>, resulting in significant infrastructure cost savings.</p>`,
  },
  {
    question:
      "What architectural patterns do you specialize in for the frontend?",
    answer: `<p>I specialize in patterns that create flexible and maintainable systems, connecting back to my "Change is Requirement #0" philosophy.</p><ul><li><strong>Micro Frontends:</strong> I have designed and led migrations to <strong>Micro Frontends</strong> architectures, such as at <a href="https://www.yapo.cl" target="_blank" rel="noopener noreferrer"><strong>Yapo.cl</strong></a>. I've also built Proof-of-Concepts using <a href="https://webpack.js.org/concepts/module-federation/" target="_blank" rel="noopener noreferrer"><strong>Webpack Module Federation</strong></a>, which allows different teams to update their micro-apps independently without a full deploy.</li><li><strong>Hexagonal Architecture:</strong> I implemented a <a href="https://alistair.cockburn.us/hexagonal-architecture/" target="_blank" rel="noopener noreferrer"><strong>Hexagonal Architecture</strong></a> (or "Ports and Adapters") for frontend web applications at <a href="https://www.yapo.cl" target="_blank" rel="noopener noreferrer"><strong>Yapo.cl</strong></a>. This pattern was key to decoupling our business logic from the UI framework, making the codebase far more testable and easier to migrate.</li></ul>`,
  },
  {
    question:
      "You've worked on many large-scale marketplaces. What is the unique challenge of that environment?",
    answer:
      '<p>The unique challenge is the <strong>sheer scale of impact</strong>. When you work on platforms like <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a> or <a href="https://www.kleinanzeigen.de" target="_blank" rel="noopener noreferrer"><strong>kleinanzeigen.de</strong></a>, you\'re operating at a level where <strong>hundreds of millions of visits</strong> happen every day. This creates two primary responsibilities:</p><ol><li><strong>Responsibility to the User:</strong> Every feature I ship, even a small change, is seen by millions of people. This makes quality and performance paramount. I see <strong>web performance as a core accessibility feature</strong>. A faster-loading page (like the work we did at <a href="https://www.subito.it" target="_blank" rel="noopener noreferrer"><strong>Subito</strong></a>) directly impacts whether a user on a slow mobile connection can access our service. Shipping code in this environment is a high-stakes, high-impact activity.</li><li><strong>Opportunity for Multiplied Impact:</strong> I work in an organization with hundreds of other developers. My most important role as a Staff Engineer isn\'t just shipping my own code; it\'s <strong>improving the work of every other engineer</strong>. When I build a better tool or optimize a CI/CD pipeline (like at <a href="https://www.leboncoin.fr" target="_blank" rel="noopener noreferrer"><strong>leboncoin.fr</strong></a>), I am multiplying my impact. By making our development process faster and safer, I enable hundreds of other developers to ship their own high-impact features to millions of users more effectively.</li></ol>',
  },
  {
    question: "What is your primary technology stack?",
    answer: `<p>I am a web specialist with deep expertise in the JavaScript/TypeScript ecosystem and the platform that supports it.</p><ul><li><strong>Frontend:</strong> React, Next.js, AstroJS, TypeScript, TailwindCSS, Jest, Cypress, Webpack, Vite.</li><li><strong>Performance & Tooling:</strong> Lighthouse, Prometheus, Grafana, Lerna.</li><li><strong>Backend & Node:</strong> Node.js, Express.js, Sails.js.</li><li><strong>Platform & CI/CD:</strong> GitHub Actions, Travis CI, Docker, Kubernetes.</li></ul>`,
  },
  {
    question: "What's your core philosophy on software development?",
    answer: `<p>My philosophy is built on one core idea—<strong>"Change is Requirement #0."</strong></p><p>I’m originally from Chile, a very seismic country. There, we learned a hard lesson: rigid buildings that fight the earth's movement will collapse. The buildings that survive are <em>flexible</em> and they are designed to move <em>with</em> the tectonic plates.</p><p>I believe software architecture is exactly the same. Business needs, technology, and requirements are the tectonic plates; they are <em>always</em> shifting. My job is to build flexible, adaptable, and resilient systems that can withstand these shocks. This leads me to be a pragmatist who values writing code for humans first.</p>`,
  },
  {
    question:
      "How do you approach a complex technical problem or a legacy system?",
    answer: `<p>With <strong>curiosity, not judgment</strong>. I firmly believe that most "bad" architectural decisions were actually the best possible decisions at the time they were made, given the context and constraints.</p><p>My first step is always to become a historian. I dig in to understand the <em>full</em> context. Why was this built? Who built it? What was happening in the company or the world at that time? Only by understanding the history and the human story behind the code can we find the right path forward without repeating past mistakes.</p>`,
  },
  {
    question: "What is your philosophy on teamwork and collaboration?",
    answer: `<p>My guiding principle is to <strong>assume good intent</strong>. I believe people work best in an environment of high trust, so I prefer a tone that is fun, friendly, and collaborative—not formal or "cutthroat."</p><p>I genuinely enjoy helping people and I get a lot of satisfaction from teaching. I believe that by elevating others, I elevate myself. Great things are built by teams that support each other, not by individuals competing.</p>`,
  },
  {
    question: "What kind of mentor or consultant are you?",
    answer: `<p>I am a <strong>teacher and a problem-solver</strong>. My goal is to make my clients' and mentees' problems go away.</p><p>I don't believe in absolutism. The tech world changes too fast for "always" or "never." Instead of forcing my opinions, I present the facts, the context, and my own real-world experiences. I’m not shy about sharing my failures; they are often the best teaching tools.</p><p>Ultimately, I want to empower you or your team to make the best decision for your specific case.</p>`,
  },
  {
    question: "Your background isn't in STEM. How does that affect your work?",
    answer: `<p>It’s true, I'm a self-taught engineer and my background is in the humanities. I see this as one of my greatest strengths.</p><p>Because I don't come from a pure math background, I’ve never seen code as just formulas. To me, <strong>code is prose</strong>. I approach software architecture as a set of text concepts and narratives. I’m a top-down processor, which means I’m obsessed with the "why" of things. I need to understand the rich context of the story before I can write the next chapter.</p>`,
  },
  {
    question: "Are you available for consulting or mentoring?",
    answer:
      '<p>Yes, I am. I offer a limited number of consulting and mentoring engagements for individuals and teams.</p><p>My focus is on helping with <strong>platform engineering</strong>, <strong>web performance</strong>, <strong>CI/CD</strong>, and <strong>scaling high-traffic web applications</strong>. I also mentor senior engineers who are on the path to a Staff-level role.</p><p>You can find all the details and how to get in touch on my <a href="/consulting"><strong>consulting page</strong></a>.</p>',
  },
];
