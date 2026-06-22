import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { ApiError } from "../utils/errorHandler.js";

const fetchProductCatalog = async () => {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");
    return data.map(p => `- [ID: ${p.id}] ${p.title} ($${p.price}) in ${p.category}`).join("\n");
  } catch (error) {
    console.error("Failed to fetch catalog for AI", error);
    return "Error loading product catalog.";
  }
};

export const generateChatResponse = async (message, history) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "AI Service is currently unavailable (Missing API Key)");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const productCatalog = await fetchProductCatalog();
  
  const systemPrompt = `You are Pixenbot, the official AI Shopping Assistant for Pixenbuy (an online e-commerce store).
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
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new ApiError(500, "Failed to get AI response.");
  }
};
