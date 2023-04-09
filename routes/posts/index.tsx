import PostCard from "../../components/PostCard.tsx";
import { PageProps } from "$fresh/server.ts";
import { getPosts, Post } from "../../utils/posts.ts";
import { Handlers } from "$fresh/server.ts";
import { Layout } from "../../components/Layout.tsx";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};

export default function BlogIndexPage(props: PageProps<Post[]>) {
  const posts = props.data;
  return (
    <Layout
      title="All Posts"
      description="Here you can find all my previous posts"
    >
      <main>
        {posts.map((post) => <PostCard post={post} />)}
      </main>
    </Layout>
  );
}
