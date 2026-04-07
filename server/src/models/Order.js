const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "standard",
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "Order needs at least one item"],
    },
    deliveryDate: {
      type: Date,
      required: true,
      index: true,
    },
    deliverySlot: {
      type: String,
      enum: ["1pm", "2pm", "5pm_plus"],
      required: true,
    },
    deliveryArea: {
      type: String,
      enum: ["cg", "near_sports_complex", "near_girls_hostel"],
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "cod"],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "prepared", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, deliveryDate: 1 });

module.exports = mongoose.model("Order", orderSchema);
