import type { Person, BlogPosting, WithContext } from "schema-dts";
import { SITE, SOCIALS } from "@consts";

export function createPersonSchema(baseUrl: URL): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SITE.NAME,
    "url": baseUrl.toString(),
    "email": SITE.EMAIL,
    "jobTitle": "Staff Software Engineer",
    "description": "Software engineer specializing in frontend development, web performance, and CI/CD optimization.",
    "sameAs": SOCIALS.map(social => social.HREF),
    "knowsAbout": [
      "Frontend Development",
      "Web Performance",
      "CI/CD",
      "JavaScript",
      "React",
      "NextJS",
      "Astro"
    ]
  };
}

export function createBlogPostingSchema(
  title: string,
  description: string,
  date: Date,
  url: URL,
  baseUrl: URL
): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "datePublished": date.toISOString(),
    "author": {
      "@type": "Person",
      "name": SITE.NAME,
      "url": `${baseUrl}about`
    },
    "publisher": {
      "@type": "Person",
      "name": SITE.NAME
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.toString()
    }
  };
}

