import { getAuth } from "@clerk/express";
import User from "../models/User.model.js";

/**
 * Middleware that resolves the MongoDB user from Clerk's auth.
 * Must be used AFTER requireAuth() — assumes req.auth.userId exists.
 * Attaches the MongoDB user document to req.user.
 */
const resolveUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        error: "User profile not found. Please create an account first.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware that restricts access to admin users only.
 * Must be used AFTER resolveUser.
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

/**
 * Middleware that restricts access to regular users only.
 * Used to block admin from purchasing.
 * Must be used AFTER resolveUser.
 */
const requireUserRole = (req, res, next) => {
  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ error: "This action is only available for regular users" });
  }
  next();
};

export { resolveUser, requireAdmin, requireUserRole };
