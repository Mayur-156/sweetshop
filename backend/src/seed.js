require("dotenv").config();
const mongoose = require("mongoose");
const Sweet = require("./models/Sweet");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Clear existing sweets
    await Sweet.deleteMany();

    // Insert seed data with category
    await Sweet.insertMany([
      {
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 50,
      },
      {
        name: "Barfi",
        category: "Indian",
        price: 20,
        quantity: 30,
      },
    ]);

    console.log("✅ Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
});
