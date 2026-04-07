const express = require("express");
const jwt = require("jsonwebtoken");
const OtpCode = require("../models/OtpCode");
const User = require("../models/User");

const router = express.Router();

const buildOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

router.post("/request-otp", async (req, res) => {
  const { channel, target } = req.body;
  if (!channel || !target) {
    return res.status(400).json({ message: "channel and target are required" });
  }

  if (!["email", "phone"].includes(channel)) {
    return res.status(400).json({ message: "Invalid channel" });
  }

  const code = buildOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OtpCode.findOneAndUpdate(
    { channel, target },
    { code, expiresAt },
    { upsert: true, new: true }
  );

  // TODO: Replace this with real email/SMS provider integration.
  return res.json({ message: "OTP generated", developmentOtp: code });
});

router.post("/verify-otp", async (req, res) => {
  const { channel, target, code, name } = req.body;
  if (!channel || !target || !code) {
    return res.status(400).json({ message: "channel, target and code are required" });
  }

  const otpDoc = await OtpCode.findOne({ channel, target });
  if (!otpDoc || otpDoc.code !== code || otpDoc.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const lookup = channel === "email" ? { email: target } : { phone: target };
  const defaults = channel === "email" ? { email: target } : { phone: target };

  const user = await User.findOneAndUpdate(
    lookup,
    { $setOnInsert: defaults, $set: { name: name || "" } },
    { new: true, upsert: true }
  );

  await OtpCode.deleteOne({ _id: otpDoc._id });

  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

module.exports = router;
