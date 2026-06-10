import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser, requireUserRole } from "../middleware/auth.middleware.js";
import * as orderController from "../controllers/order.controller.js";

const router = Router();

// All order routes require auth + resolved user + user role (only users can order)
router.use(requireAuth(), resolveUser, requireUserRole);

router.post("/", orderController.placeOrder);
router.get("/", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderById);

export default router;
