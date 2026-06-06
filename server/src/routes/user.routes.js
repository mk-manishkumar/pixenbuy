import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { resolveUser } from "../middleware/auth.middleware.js";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

// POST /api/v1/user — no resolveUser (user doesn't exist yet)
router.post("/", requireAuth(), createUser);

// All routes below need the user to exist in DB
router.get("/me", requireAuth(), resolveUser, getUser);
router.patch("/me", requireAuth(), resolveUser, updateUser);
router.delete("/me", requireAuth(), resolveUser, deleteUser);

export default router;
