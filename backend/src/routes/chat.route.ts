/**
 * Chat Routes — AI chatbot endpoint
 */
import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { chatController } from "../controllers/chat.controller";

const router = Router();

// Protected: must be logged in to use AI chat
router.post("/chat", checkAuth, chatController);

export default router;
