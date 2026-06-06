import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser } from "../middleware/auth.middleware.js";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

// All cart routes require auth + resolved user
router.use(requireAuth(), resolveUser);

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:productId", updateItem);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

export default router;
