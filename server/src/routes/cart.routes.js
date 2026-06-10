import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser, requireUserRole } from "../middleware/auth.middleware.js";
import * as cartController from "../controllers/cart.controller.js";

const router = Router();

// All cart routes require auth + resolved user + user role (blocks admin)
router.use(requireAuth(), resolveUser, requireUserRole);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:productId", cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
