const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planType: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
      index: true,
    },
    nextDeliveryDate: {
      type: Date,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
