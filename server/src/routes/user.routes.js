import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser } from "../middleware/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

// POST /api/v1/user — regular user creation (no resolveUser, user doesn't exist yet)
router.post("/", requireAuth(), userController.createUser);

// POST /api/v1/user/admin — admin creation (secret key + email validated in service)
router.post("/admin", requireAuth(), userController.createAdmin);

// All routes below need the user to exist in DB
router.get("/me", requireAuth(), resolveUser, userController.getUser);
router.patch("/me", requireAuth(), resolveUser, userController.updateUser);
router.delete("/me", requireAuth(), resolveUser, userController.deleteUser);

export default router;
