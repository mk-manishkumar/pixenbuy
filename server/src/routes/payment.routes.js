import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser } from "../middleware/auth.middleware.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = Router();

// Require auth for payment endpoints
router.use(requireAuth(), resolveUser);

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);

export default router;
