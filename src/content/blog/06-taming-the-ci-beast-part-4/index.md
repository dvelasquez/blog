---
title: "Taming the CI Beast: The Impact of Optimization (Part 4)"
description: "Quantifying the cost savings and developer productivity gains achieved by optimizing our CI/CD pipeline."
date: "January 20, 2025" 
---

![Impact of Optimization](/2025-01-20/taming-the-ci-beast-intro.png)

In the previous articles [Part 1](/blog/03-taming-the-ci-beast), [Part 2](/blog/04-taming-the-ci-beast-part-2), [Part 3](/blog/05-taming-the-ci-beast-part-3) in this series, we explored the step-by-step process of optimizing the CI/CD pipeline for a massive Next.js application. We tackled test optimization, build process improvements, and Docker image streamlining, achieving a **remarkable reduction in build times from 50 minutes (or longer!) down to just 9 minutes**.

But what was the real impact of these optimizations? How did they translate into tangible cost savings and developer productivity gains? In this article, we'll quantify the benefits and highlight the importance of choosing initiatives with measurable impact.

## The Importance of Impactful Initiatives

As engineers, we're often faced with a multitude of potential projects and improvements. It's crucial to prioritize those that deliver clear and measurable value to the business. In the case of our CI/CD optimization efforts, the impact came from two main sources:

1. **Reduced infrastructure costs:** By optimizing our pipeline, we decreased the resources required to run our CI/CD infrastructure on AWS.
2. **Improved developer productivity:**  Shorter build times translated into less time wasted by developers waiting for builds to complete.

## Quantifying the Savings

Let's start by analyzing the cost savings on our AWS infrastructure. Based on the [AWS pricing calculator](https://calculator.aws/#/) for the Ireland region (where our infrastructure is hosted), the reduction in build time from one hour to nine minutes translates to a **monthly saving of approximately €1,700**, or **€20,400 per year**. This may not seem like a massive amount for a company of our size, but it demonstrates that even small optimizations can lead to tangible cost reductions.

However, the more substantial impact came from the improvement in developer productivity. With **at least 180 pull requests per week** and a team of **100 frontend engineers**, the initial one-hour build time translated to a significant amount of wasted developer time.

To put this into perspective, let's consider the annual cost of this wasted time.  With at least 180 PRs per week and a one-hour processing time, we were spending at least 180 hours per week on CI/CD, or 9360 hours annually (180 hours/week * 52 weeks/year).

To calculate the monetary cost, we need to consider the weighted average hourly rate of a frontend engineer in Europe, where our team is primarily located. Based on data from various sources, the average yearly gross salary for a frontend developer in Germany is around €60,000, in France €60,481, and in Spain €54,636.

Considering the proportion of developers from each country in our team (75% French, 15% German, 10% Spanish), we can calculate the weighted average hourly rate:

(0.75 * €60,481/year + 0.15 * €60,000/year + 0.10 * €54,636/year) / (52 weeks/year * 40 hours/week) ≈ €30/hour

Therefore, the initial annual cost of our CI/CD process was a staggering €280,800 (9360 hours * €30/hour).

By reducing the CI/CD process time to nine minutes, we decreased the annual time spent to 1404 hours, resulting in a new annual cost of €42,120.

This translates to an annual cost savings of €238,680 and a significant reduction in wasted developer time.

![The cost of losing developer flow (from monkeyuser.com)](/2025-01-20/developer-flow.jpg)

## Beyond the Numbers: The Impact on Developer Flow

While the cost savings are impressive, the impact on developer flow and morale is equally important. Long CI/CD times can disrupt focus, create frustration, and hinder productivity.

Imagine a developer working on a small bug fix or a minor feature enhancement. They submit their code, only to be faced with an hour-long wait for the CI/CD pipeline to complete. This delay can break their concentration, forcing them to switch to other tasks and potentially lose valuable time when they return to the original task.

By reducing the CI/CD time to just nine minutes, we've created a much smoother and more efficient workflow. Developers receive faster feedback, can iterate more quickly, and maintain their focus throughout the development process.

## Conclusion

The optimization of our CI/CD pipeline has not only resulted in significant cost savings but has also dramatically improved developer productivity and morale. This initiative highlights the importance of prioritizing projects with measurable impact and demonstrates the value of investing in efficient and streamlined development processes.
