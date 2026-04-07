const express = require("express");
const Order = require("../models/Order");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(auth, adminOnly);

router.get("/orders", async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return res.json(orders);
});

router.patch("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json(order);
});

module.exports = router;
