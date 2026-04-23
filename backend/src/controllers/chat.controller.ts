/**
 * Chat Controller — handles AI chatbot requests
 */
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getChatResponse } from "../services/chat.service";

/** POST /chat — send a message to the AI tutor */
export const chatController = async (req: AuthedRequest, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await getChatResponse(message, history || []);
    return res.json({ reply });
  } catch (err) {
    console.error("Chat controller error:", err);
    return res.status(500).json({ error: "Chat service unavailable" });
  }
};
