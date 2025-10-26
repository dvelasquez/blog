---
title: "GitHub Action: Compare Lighthouse CI Results"
description: "A GitHub Action to compare Lighthouse CI results between branches, preventing performance regressions directly in your pull requests."
date: "January 10 2025" # You can adjust this date
repoURL: "https://github.com/adevinta/actions-lighthouseci-compare"
# demoURL: Add if there's a specific demo page or link, otherwise remove
---

Performance regressions are sneaky. A seemingly small change can negatively impact your Lighthouse scores, hurting user experience and SEO. Manually checking Lighthouse reports on every pull request is tedious and error-prone. That's where `actions-lighthouseci-compare` comes in.

## Motivation

While working on optimizing web performance at Adevinta marketplaces like Kleinanzeigen.de and Leboncoin.fr, we relied heavily on [Google Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) to track our scores. However, just running Lighthouse wasn't enough. We needed a way to _automatically_ compare the results from a feature branch against the main branch _before_ merging. This would allow us to catch performance regressions early in the development cycle, directly within the pull request workflow.

There wasn't a readily available GitHub Action that specifically addressed this comparison need against a running Lighthouse CI server, so I decided to build one.

## Key Features

- **Compares Lighthouse CI runs:** Fetches Lighthouse reports for the current commit (or PR branch) and compares them against the results from the base branch (e.g., `main`).
- **Pull Request Comments:** Posts a clear summary of the comparison directly as a comment on the pull request, highlighting potential regressions or improvements.
- **Integration with Lighthouse CI Server:** Designed to work seamlessly with a self-hosted or managed Lighthouse CI server instance.
- **Threshold Configuration:** Allows setting thresholds to fail the action if performance regressions exceed a certain limit (though this feature might still be under development based on the README).
- **Easy Setup:** Simple integration into existing GitHub Actions workflows.

## Technology Stack

- **Node.js:** JavaScript runtime environment
- **TypeScript:** For type safety and better maintainability
- **GitHub Actions:** Core platform for CI/CD automation
- **Lighthouse CI Server API:** Interacts with the Lighthouse CI server to fetch build reports.

## Challenges

- **API Interaction:** Interfacing reliably with the Lighthouse CI server's API to fetch the correct base and current build reports.
- **GitHub API:** Effectively using the GitHub API to post comments on pull requests and manage action outputs.
- **Asynchronous Operations:** Handling the asynchronous nature of API calls within the GitHub Action runtime.

## Lessons Learned

- **The Power of Automation in PRs:** Integrating performance checks directly into the pull request workflow is a highly effective way to prevent regressions before they reach production.
- **Developer Experience Matters:** Providing clear, concise feedback directly in the PR significantly improves the developer experience around performance monitoring.
- **Building for a Specific Need:** Creating a focused tool to solve a specific problem (comparing Lighthouse CI runs) proved more effective than trying to adapt more general tools.

## Links

- **GitHub Repository:** https://github.com/adevinta/actions-lighthouseci-compare
- **GitHub Marketplace:** https://github.com/marketplace/actions/lighthouse-ci-compare-action

## Acknowledgements

Thanks to the Google Chrome team for Lighthouse and Lighthouse CI, which form the foundation of this action. Also, thanks to the Adevinta team for supporting the development and open-sourcing of this tool.
