import { z } from "zod";

/**
 * Zod schema for the checkout form.
 * Validates customer details before placing an order.
 */
export const checkoutFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number"),
  address: z.string().min(1, "Address is required").max(500, "Address is too long"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Zod schema for adding an item to cart.
 * Validates the payload before sending to the backend.
 */
export const addToCartSchema = z.object({
  productId: z.number().int().positive("Invalid product ID"),
  title: z.string().min(1, "Title is required"),
  price: z.number().positive("Price must be positive"),
  brand: z.string().default(""),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
  image: z.union([z.url("Invalid image URL"), z.literal("")]).default(""),
});

export type AddToCartData = z.infer<typeof addToCartSchema>;

/**
 * Zod schema for updating cart item quantity.
 */
export const updateCartItemSchema = z.object({
  productId: z.number().int().positive("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type UpdateCartItemData = z.infer<typeof updateCartItemSchema>;

/**
 * Zod schema for user profile updates.
 */
export const updateUserSchema = z.object({
  name: z.string().max(100, "Name is too long").optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number")
    .or(z.literal(""))
    .optional(),
  address: z.string().max(500, "Address is too long").optional(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;

/**
 * Zod schema for placing an order.
 */
export const placeOrderSchema = z.object({
  shippingCost: z.number().min(0),
  shippingAddress: z.string().min(1, "Shipping address is required"),
});

export type PlaceOrderData = z.infer<typeof placeOrderSchema>;

/**
 * Zod schema for admin signup.
 */
export const adminSignUpSchema = z.object({
  secretKey: z.string().min(1, "Secret key is required"),
});

export type AdminSignUpData = z.infer<typeof adminSignUpSchema>;

