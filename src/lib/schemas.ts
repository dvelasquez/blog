import type {
  Person,
  BlogPosting,
  FAQPage,
  Service,
  WithContext,
  BreadcrumbList,
} from "schema-dts";
import { SITE, SOCIALS } from "@consts";
import type { FAQItem } from "@data/faq";

export function createPersonSchema(baseUrl: URL): WithContext<Person> {
  const aboutUrl = new URL("about", baseUrl).toString();
  const consultingUrl = new URL("consulting", baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": aboutUrl,
    name: SITE.NAME,
    url: baseUrl.toString(),
    email: SITE.EMAIL,
    jobTitle: "Staff Software Engineer",
    description:
      "Software engineer specializing in frontend development, web performance, and CI/CD optimization.",
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Barcelona",
        addressRegion: "Europe",
        addressCountry: "ES",
      },
    },
    worksFor: [
      {
        "@type": "Organization",
        name: "Kleinanzeigen",
        url: "https://www.kleinanzeigen.de",
      },
    ],
    alumniOf: [
      {
        "@type": "Organization",
        name: "Leboncoin",
        url: "https://www.leboncoin.fr",
      },
      {
        "@type": "Organization",
        name: "Adevinta",
        url: "https://www.adevinta.com",
      },
      {
        "@type": "Organization",
        name: "Yapo",
        url: "https://www.yapo.cl",
      },
      {
        "@type": "Organization",
        name: "Subito",
        url: "https://www.subito.it",
      },
      {
        "@type": "Organization",
        name: "Jofogas",
        url: "https://www.jofogas.hu",
      },
      {
        "@type": "Organization",
        name: "Willhaben",
        url: "https://www.willhaben.at",
      },
    ],
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Spanish",
      },
      {
        "@type": "Language",
        name: "English",
      },
    ],
    sameAs: SOCIALS.map(social => social.HREF),
    knowsAbout: [
      "Frontend Development",
      "Web Performance",
      "CI/CD",
      "JavaScript",
      "React",
      "NextJS",
      "Astro",
      "TypeScript",
      "Platform Engineering",
      "Developer Experience",
      "Systems Architecture",
      "CI/CD Optimization",
      "Monorepo Architecture",
      "Legacy System Migration",
      "Node.js",
    ],
    makesOffer: {
      "@id": consultingUrl,
    },
  };
}

export function createBlogPostingSchema(
  title: string,
  description: string,
  date: Date,
  url: URL,
  baseUrl: URL,
  keywords?: string[]
): WithContext<BlogPosting> {
  const authorId = new URL("about", baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    author: {
      "@type": "Person",
      "@id": authorId,
      name: SITE.NAME,
      email: SITE.EMAIL,
    },
    publisher: {
      "@type": "Organization",
      "@id": authorId,
      name: SITE.NAME,
      logo: {
        "@type": "ImageObject",
        url: new URL("favicon-light.svg", baseUrl).toString(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.toString(),
    },
    keywords: keywords?.join(", "),
  };
}

export function createFAQPageSchema(faqItems: FAQItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createConsultingServiceSchema(
  baseUrl: URL
): WithContext<Service> {
  const consultingUrl = new URL("consulting", baseUrl).toString();
  const authorId = new URL("about", baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": consultingUrl,
    name: "Staff-Level Engineering Consulting & Mentoring",
    description:
      "Staff-level engineering consulting and mentoring services for platform engineering, DevEx, and architecture. Helping engineering organizations scale their platforms, people, and processes.",
    provider: {
      "@id": authorId,
    },
    serviceType: "Engineering Consulting",
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: consultingUrl,
    },
    offers: {
      "@type": "Offer",
      description: "Free 30-minute discovery call to assess fit",
      price: "0",
      priceCurrency: "EUR",
    },
    category: [
      "Platform Engineering",
      "Developer Experience",
      "Systems Architecture",
      "CI/CD Optimization",
      "Technical Leadership",
      "Engineering Mentoring",
    ],
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
