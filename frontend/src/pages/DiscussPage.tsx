/**
 * DiscussPage — Blog/discussion list with search and pagination
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/api";
import PostCard from "../components/PostCard";
import type { PostPreview } from "../components/PostCard";
import "../styles/discuss.css";

export default function DiscussPage() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /** Fetch posts on mount and when page/search changes */
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts(page, 10, search || undefined);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, search]);

  /** Debounced search handler */
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="discuss-page" id="discuss-page">
      <div className="discuss-container">
        {/* Header */}
        <div className="discuss-header">
          <h1>Discussion Hub</h1>
          <Link to="/discuss/new" className="btn btn-primary" id="new-post-btn">
            ✏️ New Post
          </Link>
        </div>

        {/* Search */}
        <div className="discuss-search">
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            id="discuss-search"
          />
        </div>

        {/* Post List */}
        {loading ? (
          <div className="post-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="post-card" style={{ pointerEvents: "none" }}>
                <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "40%" }} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="discuss-empty">
            <div className="discuss-empty-icon">💬</div>
            <p>No posts yet. Be the first to start a discussion!</p>
            <Link to="/discuss/new" className="btn btn-primary">
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={p === page ? "active" : ""}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
