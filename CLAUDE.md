# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal site and blog of Danilo Velasquez, deployed at `https://d13z.dev`. It is a fully static Astro site forked from the **Astro Nano** theme, styled with Tailwind CSS v4 (through `@tailwindcss/vite`, no `tailwind.config`) and written in TypeScript. There is no UI framework: every component is a `.astro` file. The `README.md` is the upstream theme README and does not describe this site.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | `astro check` (type check, including content frontmatter) then `astro build` to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run lint` / `npm run lint:fix` | ESLint over the repo (Astro + TypeScript + Prettier rules) |
| `npx astro check` | Type check only, without building |

There is no test suite. CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm run lint` and `npm run build` on Node from `package.json` `volta.node`. A change is verified when lint and build both pass. The `npm run sync` and `npm run astro` entries in `README.md` do not exist in `package.json`; use `npx astro sync` instead.

Dependencies are pinned to exact versions and updated by Renovate; most commits are Renovate dependency bumps.

## Architecture

**Content collections** (`src/content.config.ts`) are the data source. Three collections use the `glob` loader: `blog`, `projects` and `work`. Files whose name starts with `_` are ignored. Each blog post and project lives in a numbered folder with an `index.md`/`index.mdx`, so the entry `id` (and the URL slug) is the folder name, for example `/blog/11-make-claude-speak-to-you/`. The Zod schema there is the source of truth for frontmatter; `astro check` fails the build on invalid frontmatter.

**Draft filtering is manual.** Every place that reads `blog` or `projects` (`src/pages/index.astro`, `src/pages/blog/*`, `src/pages/projects/*`, `src/pages/rss.xml.ts`) filters `!data.draft` itself. A new listing must do the same.

**Images**: post images live either next to the post (co-located `.png` referenced relatively) or under `public/<YYYY-MM-DD>/` referenced by absolute path. The post's social image is `data.image`, otherwise the first Markdown image in the body (`extractFirstImageFromMarkdown`), otherwise `/default-blog-image.jpg`.

**SEO and structured data**: `src/components/Head.astro` builds meta tags, canonical URL and font preloads. JSON-LD is generated from typed builders in `src/lib/schemas.ts` (using `schema-dts`: Person, BlogPosting, FAQPage, Service, BreadcrumbList) and injected by each page. Personal facts (employers, jobs, socials) are hardcoded in `src/lib/schemas.ts`, `src/consts.ts` and `src/data/faq.ts`, so a bio change usually touches all three.

**Site-wide config**: `src/consts.ts` holds the site name, email, per-page title/description metadata, homepage item counts and social links. `src/pages/rss.xml.ts` merges blog and projects into one feed; the sitemap comes from `@astrojs/sitemap`.

**Path aliases**: `tsconfig.json` maps `@*` to `src/*`, so imports are `@components/...`, `@layouts/...`, `@lib/...`, `@consts`, `@types`, `@data/...`.

**Styling**: global styles and Tailwind setup are in `src/styles/global.css`; use the `cn()` helper from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional classes. Prettier sorts Tailwind classes via `prettier-plugin-tailwindcss`.
