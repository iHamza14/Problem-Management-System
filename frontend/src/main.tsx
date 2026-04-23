/**
 * App Entry Point — Renders Navbar, Router, and global AIChatbot
 */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";
import AIChatbot from "./components/AIChatbot";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Navbar />
    <AppRouter />
    {/* AI Chatbot is always visible as a floating button */}
    <AIChatbot />
  </BrowserRouter>
);
