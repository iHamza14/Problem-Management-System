/**
 * Post Routes — blog/discussion API endpoints
 */
import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import {
  listPostsController,
  getPostController,
  createPostController,
  likePostController,
  addCommentController,
  likeCommentController,
} from "../controllers/post.controller";

const router = Router();

// Public: anyone can read posts
router.get("/posts", listPostsController);
router.get("/posts/:id", getPostController);

// Protected: must be logged in to create/like/comment
router.post("/posts", checkAuth, createPostController);
router.post("/posts/:id/like", checkAuth, likePostController);
router.post("/posts/:id/comments", checkAuth, addCommentController);
router.post("/comments/:id/like", checkAuth, likeCommentController);

export default router;
