import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import axios from "axios";

const fetchProductCatalog = async () => {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");
    return data.map(p => `- [ID: ${p.id}] ${p.title} ($${p.price}) in ${p.category}`).join("\n");
  } catch (error) {
    console.error("Failed to fetch catalog for AI", error);
    return "Error loading product catalog.";
  }
};

const handleChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message) throw new ApiError(400, "Message is required");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "AI Service is currently unavailable (Missing API Key)");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const productCatalog = await fetchProductCatalog();
  const systemPrompt = `You are PixenBot, the official AI Shopping Assistant for Pixenbuy (an online e-commerce store).
Your goal is to help customers find products, answer questions, and provide shopping advice.

Here is the entire current product catalog available in our store:
${productCatalog}

Rules:
1. Always be polite, concise, and helpful.
2. Only recommend products that actually exist in the catalog provided above.
3. If recommending a product, state its exact name and price.
4. You can format your response in Markdown (bold, bullet points, etc) to make it easy to read.
5. If the user asks for something outside the catalog, politely inform them we do not carry it and suggest the closest alternative from our catalog.`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt
  });

  try {
    // Convert generic history to Gemini format
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ success: true, reply: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new ApiError(500, "Failed to get AI response.");
  }
});

export { handleChat };
