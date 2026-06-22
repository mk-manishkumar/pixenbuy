import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import * as aiService from "../services/ai.service.js";

const handleChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message) throw new ApiError(400, "Message is required");

  const reply = await aiService.generateChatResponse(message, history);

  res.json({ success: true, reply });
});

export { handleChat };
