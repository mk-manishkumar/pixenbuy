import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser, requireAdmin } from "../middleware/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require auth + resolved user + admin role
router.use(requireAuth(), resolveUser, requireAdmin);

router.get("/dashboard", adminController.getDashboardStats);

export default router;
