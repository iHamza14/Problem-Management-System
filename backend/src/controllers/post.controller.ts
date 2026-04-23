/**
 * Post Controller — HTTP handlers for blog/discussion endpoints
 * Fixed TypeScript type narrowing for req.params.id
 */
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import {
  listPosts,
  getPostById,
  createPost,
  togglePostLike,
  toggleCommentLike,
  addComment,
} from "../services/post.service";

/** GET /posts — paginated list of posts */
export const listPostsController = async (req: AuthedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const data = await listPosts(page, limit, search);
    return res.json(data);
  } catch (err) {
    console.error("List posts error:", err);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

/** GET /posts/:id — single post with comments */
export const getPostController = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const postId = req.params.id as string;
    const post = await getPostById(postId, userId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    console.error("Get post error:", err);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
};

/** POST /posts — create a new post */
export const createPostController = async (req: AuthedRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const authorId = req.user!.userId;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = await createPost(authorId, title, content, tags || []);
    return res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

/** POST /posts/:id/like — toggle like on a post */
export const likePostController = async (req: AuthedRequest, res: Response) => {
  try {
    const postId = req.params.id as string;
    const result = await togglePostLike(req.user!.userId, postId);
    return res.json(result);
  } catch (err) {
    console.error("Like post error:", err);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
};

/** POST /posts/:id/comments — add a comment */
export const addCommentController = async (req: AuthedRequest, res: Response) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id as string;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = await addComment(postId, req.user!.userId, content, parentId);
    return res.status(201).json(comment);
  } catch (err) {
    console.error("Add comment error:", err);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

/** POST /comments/:id/like — toggle like on a comment */
export const likeCommentController = async (req: AuthedRequest, res: Response) => {
  try {
    const commentId = req.params.id as string;
    const result = await toggleCommentLike(req.user!.userId, commentId);
    return res.json(result);
  } catch (err) {
    console.error("Like comment error:", err);
    return res.status(500).json({ error: "Failed to toggle comment like" });
  }
};
