/**
 * Inserts sample menu items. Run from server/: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/Product");

const samples = [
  // Fruit salad bowls (fixed sizes)
  { name: "Custom Fruit Salad", category: "fruit_salad", size: "100g", price: 120, description: "Pick fruits — 100g bowl", sortOrder: 1 },
  { name: "Custom Fruit Salad", category: "fruit_salad", size: "200g", price: 200, description: "Pick fruits — 200g bowl", sortOrder: 2 },
  { name: "Custom Fruit Salad", category: "fruit_salad", size: "300g", price: 280, description: "Pick fruits — 300g bowl", sortOrder: 3 },
  // Fruits
  { name: "Apple", category: "fruits", size: "standard", price: 40, description: "Fresh apple", sortOrder: 1 },
  { name: "Banana", category: "fruits", size: "standard", price: 20, description: "Ripe banana", sortOrder: 2 },
  { name: "Orange", category: "fruits", size: "standard", price: 35, description: "Juicy orange", sortOrder: 3 },
  // Juices (predefined only)
  { name: "Orange & Ginger", category: "juices", size: "standard", price: 90, description: "Energizing blend", sortOrder: 1 },
  { name: "Berry Blast", category: "juices", size: "standard", price: 100, description: "Mixed berries", sortOrder: 2 },
  { name: "Tropical Twist", category: "juices", size: "standard", price: 95, description: "Pineapple & mango", sortOrder: 3 },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in server/.env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} products. Skipping seed (delete products in Atlas to re-seed).`);
    await mongoose.disconnect();
    return;
  }
  await Product.insertMany(samples);
  console.log(`Seeded ${samples.length} products.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
