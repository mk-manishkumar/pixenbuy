import { Router } from "express";
import { handleChat } from "../controllers/ai.controller.js";

const router = Router();

// We don't require authentication here so guests can also use the chat
// POST /api/v1/ai/chat
router.post("/chat", handleChat);

export default router;
