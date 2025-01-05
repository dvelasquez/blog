---
title: "Lighthouse Viewer: Embed Lighthouse Reports in Your Web Projects" 
description: "Easily integrate and view Lighthouse performance reports within your Vue, React, Svelte, or vanilla JavaScript projects with Lighthouse Viewer."
date: "January 5 2025" 
demoURL: "https://dvelasquez.github.io/lighthouse-viewer/index.html" 
repoURL: "https://github.com/dvelasquez/lighthouse-viewer" 
---

![Lighthouse Viewer](/projects/lighthouse-viewer.png)

Lighthouse Viewer is a developer tool that simplifies the process of viewing and analyzing Lighthouse performance reports directly within your web projects. It's available as a wrapper component for popular JavaScript frameworks like VueJS (v2 and v3), React, and Svelte, and also works with vanilla JavaScript. This means you can seamlessly integrate Lighthouse reports into your development workflow, regardless of your preferred framework.

## Motivation

Before Lighthouse v10 or v11, accessing its powerful report viewer wasn't easy. Developers had to use the auto-generated HTML or a separate webpage to analyze the JSON output.

To solve this, I created Lighthouse Viewer. It started as a solution for my own web performance analysis workflow, where I was running Lighthouse audits on multiple pages regularly. By creating a wrapper around the Lighthouse viewer, I could streamline the process of exploring and understanding these reports.

## Key Features

* **Framework Support:** Works with VueJS (v2 & v3), React, Svelte, and vanilla JavaScript projects.
* **Easy Integration:** Simple to install and set up.
* **Customizable:** Options to tailor the report display to your needs.
* **Improved Developer Experience:** Streamlines performance analysis during development.
* **Self-Contained:** Includes all necessary Lighthouse viewer components without external dependencies.

## Technology Stack

* **Frontend Frameworks:** VueJS, React, Svelte
* **Build Tools:** Vite
* **Lighthouse:**  Google's open-source performance auditing tool ([Learn more about Lighthouse](https://developers.google.com/web/tools/lighthouse))
* **E2E Testing:** Cypress

## Challenges

* **Early Versions:**  Integrating the Lighthouse viewer initially required extensive code manipulation and automation to extract and update necessary components from the Lighthouse codebase.
* **Maintaining Consistency:**  Ensuring consistent functionality and styling across different framework implementations.
* **Handling Updates:**  Keeping the wrapper up-to-date with the latest changes in Lighthouse, especially during periods of significant codebase changes.

## Lessons Learned

* **The importance of automation:**  Automating the process of extracting, updating, and testing the Lighthouse viewer components saved significant time and effort, especially during early development. This automation now ensures that the project stays current with minimal manual intervention.
* **The value of modular design:**  Creating a well-structured and modular codebase made it easier to support multiple frameworks and manage updates.
* **The power of perseverance:**  Overcoming the initial challenges of integrating the Lighthouse viewer led to a valuable tool that benefits the web development community.

## Links

* **Live Demo:** https://dvelasquez.github.io/lighthouse-viewer/index.html
* **GitHub Repository:** https://github.com/dvelasquez/lighthouse-viewer
* **NPM Packages:**
    * **Vanilla JS:** https://www.npmjs.com/package/lighthouse-viewer
    * **React:** https://www.npmjs.com/package/react2-lighthouse-viewer
    * **Svelte:** https://www.npmjs.com/package/svelte-lighthouse-viewer
    * **VueJS 2:** https://www.npmjs.com/package/vue-lighthouse-viewer
    * **VueJS 3:** https://www.npmjs.com/package/vue3-lighthouse-viewer

## Acknowledgements

I would like to thank the Lighthouse team at Google for their continuous efforts to improve web performance and accessibility. Special thanks to the open-source community for their valuable contributions and feedback.

Also I would like to thank the creator of [react-lighthouse-viewer](https://www.npmjs.com/package/react-lighthouse-viewer) for the inspiration to create this project.