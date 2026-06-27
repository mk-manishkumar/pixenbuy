import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import { fetchProductById } from "../utils/fetchProduct.js";

/**
 * Get all dashboard statistics for the admin.
 */
const getDashboardStats = async () => {
  // Total registered users (excluding admin)
  const totalUsers = await User.countDocuments({ role: "user" });

  // Aggregate order stats
  const orderStats = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalItemsPurchased: { $sum: "$totalItems" },
        totalEarnings: {
          $sum: { $add: ["$totalPrice", "$shippingCost"] },
        },
      },
    },
  ]);

  const stats = orderStats[0] || {
    totalOrders: 0,
    totalItemsPurchased: 0,
    totalEarnings: 0,
  };

  // Per-product purchase counts
  const productPurchaseCounts = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        title: { $first: "$items.title" },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
    },
    { $sort: { totalQuantity: -1 } },
  ]);

  return {
    totalUsers,
    totalOrders: stats.totalOrders,
    totalItemsPurchased: stats.totalItemsPurchased,
    totalEarnings: Math.round(stats.totalEarnings * 100) / 100,
    productPurchaseCounts,
  };
};

/**
 * Get all registered users (excluding admins).
 */
const getAllUsers = async () => {
  const users = await User.find({ role: "user" })
    .select("-clerkId")
    .sort({ createdAt: -1 });
  return users;
};

/**
 * Get all orders for shipment details.
 */
const getAllOrders = async () => {
  const orders = await Order.find({ paymentStatus: "paid" })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  return orders;
};

export { getDashboardStats, getAllUsers, getAllOrders };
