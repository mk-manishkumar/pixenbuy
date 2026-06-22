import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { handleChat } from "../controllers/ai.controller.js";

const router = Router();

router.post("/chat", requireAuth(), handleChat);

export default router;
