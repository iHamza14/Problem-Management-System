import { Router } from "express";
import authRoutes from "./auth.route";
import reviseRoutes from "./revise.route";
import postRoutes from "./post.route";
import chatRoutes from "./chat.route";
import studylogRoutes from "./studylog.route";

const router = Router();

// group routes
router.use(authRoutes);        // /auth/google, /auth/me, /auth/logout
router.use(reviseRoutes);      // /revise, /handle, /stats/histogram, /refresh/user
router.use(postRoutes);        // /posts, /posts/:id, /posts/:id/like, /comments/:id/like
router.use(chatRoutes);        // /chat
router.use(studylogRoutes);    // /studylog, /stats/summary


export default router;
