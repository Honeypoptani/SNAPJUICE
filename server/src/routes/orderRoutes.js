const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { auth } = require("../middleware/auth");

const router = express.Router();

const DELIVERY_FEE = 20;

const isDeliveryDateValid = (deliveryDate) => {
  const selected = new Date(deliveryDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  return selected.getTime() >= tomorrow.getTime();
};

router.post("/", auth, async (req, res) => {
  const { items, deliveryDate, deliverySlot, deliveryArea, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order needs at least one item" });
  }
  if (!isDeliveryDateValid(deliveryDate)) {
    return res.status(400).json({ message: "Orders must be placed at least one day prior" });
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const normalizedItems = [];
  let subtotal = 0;
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) return res.status(400).json({ message: "Invalid product in items" });
    const qty = Number(item.qty || 1);
    const unitPrice = product.price;
    subtotal += unitPrice * qty;
    normalizedItems.push({
      productId: product._id,
      name: product.name,
      size: product.size,
      qty,
      unitPrice,
    });
  }

  const order = await Order.create({
    userId: req.user.userId,
    items: normalizedItems,
    deliveryDate,
    deliverySlot,
    deliveryArea,
    paymentMethod,
    deliveryFee: DELIVERY_FEE,
    subtotal,
    total: subtotal + DELIVERY_FEE,
  });

  return res.status(201).json(order);
});

router.get("/mine", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  return res.json(orders);
});

module.exports = router;
