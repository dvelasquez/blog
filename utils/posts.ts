import extract from "$std/front_matter/any.ts";
import { join } from "$std/path/mod.ts";

interface Post {
  slug: string;
  title: string;
  template: string;
  publishedAt: Date;
  category: string;
  description?: string;
  content: string;
  snippet: string;
  tags?: string[];
}

async function getPosts(): Promise<Post[]> {
  const files = Deno.readDir("./content/posts");
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const posts = await Promise.all(promises) as Post[];
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

async function getPost(slug: string): Promise<Post | null> {
  const text = await Deno.readTextFile(join("./content/posts", `${slug}.md`));
  const { attrs, body } = extract(text);
  return {
    slug,
    title: attrs.title as string,
    publishedAt: new Date(Date.parse(attrs.published_at as string)),
    content: body,
    snippet: attrs.snippet as string,
    tags: attrs.tags as string[],
    template: attrs.template as string,
    category: attrs.category as string,
    description: attrs.description as string,
  };
}

export { getPost, getPosts };

export type { Post };