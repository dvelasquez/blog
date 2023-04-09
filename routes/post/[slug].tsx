import { Handlers, PageProps } from "$fresh/server.ts";
import { Post,getPost } from "../../utils/posts.ts";
import { render } from "$gfm";
import { Layout } from "../../components/Layout.tsx"

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.slug);
    if (post === null) return ctx.renderNotFound();
    return ctx.render(post);
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (<Layout title={post.title}>
    <main class="max-w-screen-md px-4 pt-16 mx-auto">
        <h1 class="text-5xl font-bold">{post.title}</h1>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </time>
        <div class="mt-8"
          dangerouslySetInnerHTML={{ __html: render(post.content) }}
          />
      </main>
  </Layout>)
}