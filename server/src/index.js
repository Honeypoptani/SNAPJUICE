require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Default 5050: macOS often uses 5000 for AirPlay Receiver — wrong service → 403 on /api/*
const PORT = process.env.PORT || 5050;

// Start HTTP first so /api/health works even if MongoDB is still connecting or misconfigured.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SnapJuice API running on http://127.0.0.1:${PORT}`);
  console.log(`Health check: http://127.0.0.1:${PORT}/api/health`);
  connectDB().catch((err) => {
    console.error("MongoDB connection failed — fix MONGODB_URI in server/.env");
    console.error(err.message);
  });
});
