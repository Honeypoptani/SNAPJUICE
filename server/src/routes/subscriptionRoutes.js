const express = require("express");
const Subscription = require("../models/Subscription");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const payload = { ...req.body, userId: req.user.userId };
  const subscription = await Subscription.create(payload);
  return res.status(201).json(subscription);
});

router.get("/mine", auth, async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  return res.json(subscriptions);
});

router.patch("/:id", auth, async (req, res) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  if (!subscription) return res.status(404).json({ message: "Subscription not found" });
  return res.json(subscription);
});

module.exports = router;
