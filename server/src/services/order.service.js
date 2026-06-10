import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";
import { ApiError } from "../utils/errorHandler.js";

/**
 * Place an order by snapshotting the user's cart.
 * Clears the cart after order is created.
 */
const placeOrder = async (userId, { shippingCost, shippingAddress }) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Snapshot cart items (excluding images per requirements)
  const orderItems = cart.items.map((item) => ({
    productId: item.productId,
    title: item.title,
    price: item.price,
    brand: item.brand,
    quantity: item.quantity,
  }));

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice =
    Math.round(
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
        100
    ) / 100;

  const order = await Order.create({
    userId,
    items: orderItems,
    totalItems,
    totalPrice,
    shippingCost: shippingCost || 0,
    shippingAddress,
    status: "placed",
  });

  // Clear the cart
  cart.items = [];
  await cart.save();

  return order;
};

/**
 * Get a user's orders with pagination.
 */
const getUserOrders = async (userId, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId }),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
    },
  };
};

/**
 * Get a single order by ID (scoped to user).
 */
const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};

export { placeOrder, getUserOrders, getOrderById };
