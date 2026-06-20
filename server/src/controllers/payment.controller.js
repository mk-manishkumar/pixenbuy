import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to pay for this order");
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round((order.totalPrice + order.shippingCost) * 100), // amount in the smallest currency unit
    currency: "USD",
    receipt: order._id.toString(),
  };

  const razorpayOrder = await razorpay.orders.create(options);
  
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    throw new ApiError(400, "Invalid payment signature");
  }
});
