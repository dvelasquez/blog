import type { Person, BlogPosting, WithContext } from "schema-dts";
import { SITE, SOCIALS } from "@consts";

export function createPersonSchema(baseUrl: URL): WithContext<Person> {
  const aboutUrl = new URL("about", baseUrl).toString();
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": aboutUrl,
    "name": SITE.NAME,
    "url": baseUrl.toString(),
    "email": SITE.EMAIL,
    "jobTitle": "Staff Software Engineer",
    "description": "Software engineer specializing in frontend development, web performance, and CI/CD optimization.",
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Barcelona",
        "addressRegion": "Europe",
        "addressCountry": "ES"
      }
    },
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Leboncoin",
        "url": "https://www.leboncoin.fr"
      },
      {
        "@type": "Organization",
        "name": "Kleinanzeigen",
        "url": "https://www.kleinanzeigen.de"
      },
      {
        "@type": "Organization",
        "name": "Adevinta",
        "url": "https://www.adevinta.com"
      }
    ],
    "knowsLanguage": [
      {
        "@type": "Language",
        "name": "Spanish"
      },
      {
        "@type": "Language",
        "name": "English"
      }
    ],
    "sameAs": SOCIALS.map(social => social.HREF),
    "knowsAbout": [
      "Frontend Development",
      "Web Performance",
      "CI/CD",
      "JavaScript",
      "React",
      "NextJS",
      "Astro",
      "TypeScript"
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
  const authorId = new URL("about", baseUrl).toString();
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "datePublished": date.toISOString(),
    "author": {
      "@id": authorId
    },
    "publisher": {
      "@id": authorId
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.toString()
    }
  };
}

