import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/order.service.js";

// POST /api/v1/orders
const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id, req.body);
  res.status(201).json(order);
});

// GET /api/v1/orders
const getUserOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const result = await orderService.getUserOrders(req.user._id, page, limit);
  res.json(result);
});

// GET /api/v1/orders/:orderId
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.user._id,
    req.params.orderId
  );
  res.json(order);
});

export { placeOrder, getUserOrders, getOrderById };
