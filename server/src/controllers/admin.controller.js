import asyncHandler from "../utils/asyncHandler.js";
import * as adminService from "../services/admin.service.js";

// GET /api/v1/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json(stats);
});

// GET /api/v1/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.json(users);
});

// GET /api/v1/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await adminService.getAllOrders();
  res.json(orders);
});

export { getDashboardStats, getAllUsers, getAllOrders };
