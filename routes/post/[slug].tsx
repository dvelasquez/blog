import { Handlers, PageProps } from "$fresh/server.ts";
import { getPost, Post } from "../../utils/posts.ts";
import { render } from "$gfm";
import { Layout } from "../../components/Layout.tsx";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.slug);
    if (post === null) return ctx.renderNotFound();
    return ctx.render(post);
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (
    <Layout title={post.title} description={post.description} tags={post.tags}>
      <main dangerouslySetInnerHTML={{ __html: render(post.content) }}></main>
    </Layout>
  );
}
