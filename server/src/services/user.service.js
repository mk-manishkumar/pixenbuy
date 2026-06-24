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
    // Single-Owner Architecture: Check if this is the designated admin email
    const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

    user = await User.create({
      clerkId,
      email,
      name: name || "",
      role: isAdmin ? "admin" : "user",
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

export { createUser, updateUser, deleteUser };
