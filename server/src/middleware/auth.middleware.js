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

export { resolveUser };
