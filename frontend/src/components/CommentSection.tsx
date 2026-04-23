/**
 * CommentSection — Displays comment thread with nested replies
 * Supports adding comments and inline replies
 */
import { useState } from "react";
import { createComment } from "../services/api";

type CommentUser = {
  id: string;
  email: string;
  handle?: string | null;
};

export type CommentData = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  user: CommentUser;
  _count: { likes: number };
};

type CommentSectionProps = {
  postId: string;
  comments: CommentData[];
  isLoggedIn: boolean;
  onCommentAdded: () => void;
};

const CommentSection = ({
  postId,
  comments,
  isLoggedIn,
  onCommentAdded,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Build a tree of comments: top-level + nested replies
  const topLevel = comments.filter((c) => !c.parentId);
  const childrenMap = new Map<string, CommentData[]>();
  comments.forEach((c) => {
    if (c.parentId) {
      const existing = childrenMap.get(c.parentId) || [];
      existing.push(c);
      childrenMap.set(c.parentId, existing);
    }
  });

  /** Handle submitting a new top-level comment */
  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createComment(postId, newComment.trim());
      setNewComment("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>

      {/* New comment form */}
      {isLoggedIn && (
        <div className="comment-form">
          <textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="comment-form-actions">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      )}

      {/* Comment thread */}
      <div className="comment-thread">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={childrenMap}
            postId={postId}
            isLoggedIn={isLoggedIn}
            onReplyAdded={onCommentAdded}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

/* ─── Single Comment Item (recursive for replies) ─── */
type CommentItemProps = {
  comment: CommentData;
  replies: Map<string, CommentData[]>;
  postId: string;
  isLoggedIn: boolean;
  onReplyAdded: () => void;
};

const CommentItem = ({
  comment,
  replies,
  postId,
  isLoggedIn,
  onReplyAdded,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const childComments = replies.get(comment.id) || [];

  const date = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createComment(postId, replyText.trim(), comment.id);
      setReplyText("");
      setShowReplyForm(false);
      onReplyAdded();
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">
          {comment.user.handle || comment.user.email.split("@")[0]}
        </span>
        <span className="comment-date">{date}</span>
      </div>
      <div className="comment-body">{comment.content}</div>
      <div className="comment-actions">
        {isLoggedIn && (
          <button
            className="comment-action-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            ↩ Reply
          </button>
        )}
        <span className="comment-action-btn" style={{ cursor: "default" }}>
          ❤️ {comment._count.likes}
        </span>
      </div>

      {/* Inline reply form */}
      {showReplyForm && (
        <div className="reply-form">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReply()}
          />
          <button
            className="btn btn-primary"
            onClick={handleReply}
            disabled={!replyText.trim() || submitting}
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            Reply
          </button>
        </div>
      )}

      {/* Nested replies */}
      {childComments.length > 0 && (
        <div className="comment-replies">
          {childComments.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={replies}
              postId={postId}
              isLoggedIn={isLoggedIn}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
