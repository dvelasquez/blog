import { Post } from "../utils/posts.ts";

function PostCard(props: { post: Post }) {
  const { post } = props;
  return (
    <div>
      <a href={`/post/${post.slug}`}>
        <div>
          {post.title}
        </div>
      </a>
    </div>
  );
}

export default PostCard;
