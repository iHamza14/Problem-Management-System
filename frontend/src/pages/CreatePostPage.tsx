/**
 * CreatePostPage — Form to create a new blog/discussion post
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPost } from "../services/api";
import "../styles/discuss.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Parse comma-separated tags
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const post = await createPost({ title, content, tags });
      navigate(`/discuss/${post.id}`);
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-page" id="create-post-page">
      <div className="create-post-container">
        <Link to="/discuss" className="post-detail-back">
          ← Back to Discussions
        </Link>

        <div className="create-post-card">
          <h1>Create a New Post</h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="post-title">
                Title
              </label>
              <input
                type="text"
                id="post-title"
                className="input"
                placeholder="e.g., How to approach DP on trees?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label" htmlFor="post-content">
                Content
              </label>
              <textarea
                id="post-content"
                className="input"
                placeholder="Share your thoughts, approach, or question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label" htmlFor="post-tags">
                Tags
              </label>
              <input
                type="text"
                id="post-tags"
                className="input"
                placeholder="dp, trees, codeforces (comma separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <p className="form-hint">
                Separate tags with commas. e.g.: dp, greedy, binary-search
              </p>
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "var(--color-error)", fontSize: 14, marginBottom: 16 }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !title.trim() || !content.trim()}
              style={{ width: "100%" }}
            >
              {submitting ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
