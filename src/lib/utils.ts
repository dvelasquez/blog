import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (endDate) {
    if (typeof endDate === "string") {
      endMonth = "";
      endYear = endDate;
    } else {
      endMonth = endDate.toLocaleString("default", { month: "short" });
      endYear = endDate.getFullYear().toString();
    }
  }

  return `${startMonth}${startYear} - ${endMonth}${endYear}`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')           // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')           // Replace non-breaking spaces
    .replace(/&amp;/g, '&')            // Replace ampersands
    .replace(/&lt;/g, '<')             // Replace less-than
    .replace(/&gt;/g, '>')             // Replace greater-than
    .replace(/&quot;/g, '"')           // Replace quotes
    .replace(/&#39;/g, "'")            // Replace apostrophes
    .replace(/[\u201C\u201D]/g, '"')   // Replace curly double quotes
    .replace(/[\u2018\u2019]/g, "'")   // Replace curly single quotes
    .replace(/[\u2014]/g, '--')        // Replace em dashes
    .replace(/[\u2013]/g, '-')         // Replace en dashes
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .trim();
}