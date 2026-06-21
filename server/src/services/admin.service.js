import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import { fetchProductById } from "../utils/fetchProduct.js";

/**
 * Get all dashboard statistics for the admin.
 */
const getDashboardStats = async () => {
  // Total registered users (excluding admin)
  const totalUsers = await User.countDocuments({ role: "user" });

  // Fetch all products from FakeStoreAPI
  const axios = (await import("axios")).default;
  const productsRes = await axios.get("https://fakestoreapi.com/products");
  const products = productsRes.data;
  const totalProducts = products.length;

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

  // Merge with product list (include products with 0 purchases)
  const productStats = products.map((product) => {
    const purchaseData = productPurchaseCounts.find(
      (p) => p._id === product.id
    );
    return {
      productId: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      totalQuantity: purchaseData ? purchaseData.totalQuantity : 0,
      totalRevenue: purchaseData
        ? Math.round(purchaseData.totalRevenue * 100) / 100
        : 0,
    };
  });

  return {
    totalUsers,
    totalProducts,
    totalOrders: stats.totalOrders,
    totalItemsPurchased: stats.totalItemsPurchased,
    totalEarnings: Math.round(stats.totalEarnings * 100) / 100,
    productStats,
  };
};

export { getDashboardStats };
