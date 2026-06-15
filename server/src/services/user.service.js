import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";
import { ApiError } from "../utils/errorHandler.js";

/**
 * Create a new user profile linked to a Clerk account.
 * Idempotent — returns existing user if already created.
 */
const createUser = async (clerkId, { email, name }) => {
  let user = await User.findOne({ clerkId });
  if (user) {
    return { user, created: false };
  }

  try {
    user = await User.create({
      clerkId,
      email,
      name: name || "",
      role: "user",
    });
    return { user, created: true };
  } catch (error) {
    // Handle race condition on duplicate key
    if (error.code === 11000) {
      user = await User.findOne({ clerkId });
      return { user, created: false };
    }
    throw error;
  }
};

/**
 * Create an admin account.
 * Requires matching ADMIN_SECRET_KEY and ADMIN_EMAIL env vars.
 * Only one admin is allowed on the platform.
 */
const createAdmin = async (clerkId, { email, name, secretKey }) => {
  // Validate secret key
  if (!process.env.ADMIN_SECRET_KEY || secretKey !== process.env.ADMIN_SECRET_KEY) {
    throw new ApiError(403, "Invalid admin secret key");
  }

  // Validate admin email
  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
    throw new ApiError(403, "This email is not authorized for admin access");
  }

  // Check if an admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    if (existingAdmin.clerkId !== clerkId) {
      throw new ApiError(409, "An admin account already exists");
    }
    // If it's the same user, just return success
    return { user: existingAdmin, created: false };
  }

  // Check if this clerk user already has an account
  let user = await User.findOne({ clerkId });
  if (user) {
    // If user exists but is not admin, upgrade role
    if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    return { user, created: false };
  }

  try {
    user = await User.create({
      clerkId,
      email,
      name: name || "",
      role: "admin",
    });
    return { user, created: true };
  } catch (error) {
    if (error.code === 11000) {
      user = await User.findOne({ clerkId });
      return { user, created: false };
    }
    throw error;
  }
};

/**
 * Update allowed profile fields for a user.
 */
const updateUser = async (userId, updates) => {
  const allowedFields = ["name", "phone", "address"];
  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  return user;
};

/**
 * Delete a user and their associated cart and orders.
 */
const deleteUser = async (userId) => {
  await Cart.findOneAndDelete({ userId });
  await Order.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
};

export { createUser, createAdmin, updateUser, deleteUser };
