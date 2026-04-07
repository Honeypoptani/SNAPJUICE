const express = require("express");
const Product = require("../models/Product");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ category: 1, sortOrder: 1 });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).json(product);
});

router.patch("/:id", auth, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
});

module.exports = router;
