import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
