
import axios from "axios";
import { ApiError } from "../utils/errorHandler.js";

const fetchProductCatalog = async () => {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    // Generate URL slugs from titles (e.g. "Mens Cotton Jacket" -> "mens-cotton-jacket")
    return data.map(p => {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return `- ${p.title} ($${p.price}) in ${p.category}. Link: ${frontendUrl}/product/${slug}`;
    }).join("\n");
  } catch (error) {
    console.error("Failed to fetch catalog for AI", error);
    return "Error loading product catalog.";
  }
};

export const generateChatResponse = async (message, history) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "AI Service is currently unavailable (Missing API Key)");
  }

  const productCatalog = await fetchProductCatalog();
  
  const systemPrompt = `You are Pixenbot, the official AI Shopping Assistant for Pixenbuy (an online e-commerce store).
Your goal is to help customers find products, answer questions, and provide shopping advice.

Here is the entire current product catalog available in our store:
${productCatalog}

Rules:
1. Always be polite, concise, and helpful.
2. Only recommend products that actually exist in the catalog provided above.
3. When recommending a product, YOU MUST explicitly provide its clickable link using Markdown format like this: [Product Name](http://link-to-product)
4. Format your response cleanly using Markdown (bold, bullet points). Try to avoid massive tables, prefer simple bulleted lists instead.
5. If the user asks for something outside the catalog, politely inform them we do not carry it and suggest the closest alternative from our catalog.`;

  try {
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    })) : [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "Pixenbuy",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to get AI response.");
  }
};
