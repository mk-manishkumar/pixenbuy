import Cart from "../models/Cart.model.js";
import { ApiError } from "../utils/errorHandler.js";

/**
 * Compute cart totals and format the response.
 */
const formatCartResponse = (cart) => {
  const items = cart ? cart.items : [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
};

/**
 * Get a user's cart with computed totals.
 */
const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return formatCartResponse(cart);
};

/**
 * Add an item to cart, or increment quantity if it already exists.
 */
const addItem = async (userId, itemData) => {
  const { productId, title, price, brand, quantity, image } = itemData;

  if (!productId || !title || price === undefined) {
    throw new ApiError(400, "productId, title, and price are required");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({
      productId,
      title,
      price,
      brand: brand || "",
      quantity: quantity || 1,
      image: image || "",
    });
  }

  await cart.save();
  return formatCartResponse(cart);
};

/**
 * Update the quantity of a specific item in the cart.
 */
const updateItem = async (userId, productId, quantity) => {
  if (quantity === undefined || quantity < 1) {
    throw new ApiError(400, "quantity is required and must be at least 1");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((item) => item.productId === productId);
  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();

  return formatCartResponse(cart);
};

/**
 * Remove an item from the cart.
 */
const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cart.save();

  return formatCartResponse(cart);
};

/**
 * Clear all items from the cart.
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return formatCartResponse(null);
};

export { getCart, addItem, updateItem, removeItem, clearCart };
