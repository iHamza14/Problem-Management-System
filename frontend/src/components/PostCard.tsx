/**
 * PostCard — Reusable blog post preview card for the discussion list
 */
import { Link } from "react-router-dom";

export type PostPreview = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { id: string; email: string; handle?: string | null };
  tags: { tag: { id: number; name: string } }[];
  _count: { likes: number; comments: number };
};

type PostCardProps = {
  post: PostPreview;
};

const PostCard = ({ post }: PostCardProps) => {
  // Truncate content for excerpt
  const excerpt =
    post.content.length > 150
      ? post.content.slice(0, 150) + "..."
      : post.content;

  // Format date
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/discuss/${post.id}`} className="post-card" id={`post-${post.id}`}>
      <h3 className="post-card-title">{post.title}</h3>
      <p className="post-card-excerpt">{excerpt}</p>

      <div className="post-card-meta">
        <span className="post-card-author">
          {post.author.handle || post.author.email.split("@")[0]}
        </span>
        <span>{date}</span>
        <span className="post-card-stat">❤️ {post._count.likes}</span>
        <span className="post-card-stat">💬 {post._count.comments}</span>
      </div>

      {post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((t) => (
            <span key={t.tag.id} className="badge badge-accent">
              {t.tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default PostCard;
