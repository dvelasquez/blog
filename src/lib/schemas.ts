import type { Person, BlogPosting, FAQPage, Service, WithContext } from "schema-dts";
import { SITE, SOCIALS } from "@consts";
import type { FAQItem } from "@data/faq";
import { stripHtml } from "@lib/utils";

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

export function createFAQPageSchema(faqItems: FAQItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(item.answer)
      }
    }))
  };
}

export function createConsultingServiceSchema(baseUrl: URL): WithContext<Service> {
  const consultingUrl = new URL("consulting", baseUrl).toString();
  const authorId = new URL("about", baseUrl).toString();
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": consultingUrl,
    "name": "Staff-Level Engineering Consulting & Mentoring",
    "description": "Staff-level engineering consulting and mentoring services for platform engineering, DevEx, and architecture. Helping engineering organizations scale their platforms, people, and processes.",
    "provider": {
      "@id": authorId
    },
    "serviceType": "Engineering Consulting",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": consultingUrl
    },
    "offers": {
      "@type": "Offer",
      "description": "Free 30-minute discovery call to assess fit",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "category": [
      "Platform Engineering",
      "Developer Experience",
      "Systems Architecture",
      "CI/CD Optimization",
      "Technical Leadership",
      "Engineering Mentoring"
    ]
  };
}
