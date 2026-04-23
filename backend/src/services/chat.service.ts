/**
 * Chat Service — Gemini AI integration for DSA tutoring
 * Proxies user messages to Google Gemini with a system prompt
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client (lazy — only fails when actually called without key)
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};


// System prompt that guides the AI to be a helpful DSA tutor
const SYSTEM_PROMPT = `You are a friendly and knowledgeable DSA (Data Structures & Algorithms) tutor on the PracticeCF platform. Your role is to:

1. GUIDE users toward solutions — don't give direct answers unless explicitly asked
2. Ask clarifying questions about their approach first
3. Suggest which data structure or algorithm pattern might apply
4. Help debug their logic by asking about edge cases
5. Explain time/space complexity when relevant
6. Use simple, encouraging language
7. If a user shares a problem link or name, help them think through the approach
8. Format code snippets using markdown code blocks

Keep responses concise but helpful. You're a tutor, not a solution generator.`;

/** Send a message to Gemini and get a response */
export async function getChatResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const model = getModel();

    // Build the conversation context
    const contents = [
      // System instruction as first user message
      { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model" as const, parts: [{ text: "Understood! I'm ready to help with DSA questions. What problem are you working on?" }] },
      // Previous conversation history
      ...conversationHistory.map((msg) => ({
        role: (msg.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: msg.content }],
      })),
      // Current message
      { role: "user" as const, parts: [{ text: userMessage }] },
    ];

    const result = await model.generateContent({ contents });
    const response = result.response;
    return response.text();
  } catch (err: any) {
    console.error("Gemini API error:", err.message);
    
    // Graceful fallback if API key is missing
    if (err.message?.includes("GEMINI_API_KEY")) {
      return "🔑 AI chatbot is not configured yet. Please add a GEMINI_API_KEY to your backend .env file to enable this feature.";
    }

    return "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}


