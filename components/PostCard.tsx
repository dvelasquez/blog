import { Post } from "../utils/posts.ts";

function PostCard(props: { post: Post }) {
  const { post } = props;
  return (
    <article class="card">
      <a href={`/post/${post.slug}`}>
          <h2>{post.title}</h2>
      </a>
      <p>{post.description}</p>
    </article>
  );
}

export default PostCard;
