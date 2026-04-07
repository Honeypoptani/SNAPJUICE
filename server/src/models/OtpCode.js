const mongoose = require("mongoose");

const otpCodeSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    target: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpCode", otpCodeSchema);
