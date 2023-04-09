import PostCard from "../../components/PostCard.tsx";
import { PageProps } from "$fresh/server.ts";
import { Head } from "https://deno.land/x/fresh@1.1.5/runtime.ts";
import { Post, getPosts } from "../../utils/posts.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};


export default function BlogIndexPage(props: PageProps<Post[]>) {
  const posts = props.data;
  return (
    <>
    <Head>
        <title>Fresh App</title>
        <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" />
      </Head>
    <main class="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 class="text-5xl font-bold">Blog</h1>
      <div class="mt-8">
        {posts.map((post) => (<PostCard post={post} />))}
      </div>
    </main>
    </>
  );
}