import asyncHandler from "../utils/asyncHandler.js";
import * as cartService from "../services/cart.service.js";

// GET /api/v1/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.json(cart);
});

// POST /api/v1/cart/items
const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body);
  res.status(201).json(cart);
});

// PATCH /api/v1/cart/items/:productId
const updateItem = asyncHandler(async (req, res) => {
  const productId = Number.parseInt(req.params.productId);
  const { quantity } = req.body;
  const cart = await cartService.updateItem(req.user._id, productId, quantity);
  res.json(cart);
});

// DELETE /api/v1/cart/items/:productId
const removeItem = asyncHandler(async (req, res) => {
  const productId = Number.parseInt(req.params.productId);
  const cart = await cartService.removeItem(req.user._id, productId);
  res.json(cart);
});

// DELETE /api/v1/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json(cart);
});

export { getCart, addItem, updateItem, removeItem, clearCart };
