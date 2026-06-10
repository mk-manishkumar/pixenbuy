import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import userRoutes from "./src/routes/user.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

const app = express();

// hide Express version from response headers
app.disable("x-powered-by");

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Pixenbuy API is running" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export for Vercel
export default app;
