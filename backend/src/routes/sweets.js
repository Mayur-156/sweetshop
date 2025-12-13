const express = require("express");
const router = express.Router();

const Sweet = require("../models/Sweet");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  addSweet,
  getSweets,
  updateSweet,
  deleteSweet,
  restockSweet, // ✅ IMPORT ADDED
} = require("../controllers/sweetsController");

/* ======================
   PUBLIC ROUTES
====================== */

// Get all sweets
router.get("/", getSweets);

// 🔍 Search sweets
// /api/sweets/search?name=laddu&minPrice=50&maxPrice=200
router.get("/search", async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.status(200).json(sweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* ======================
   ADMIN ROUTES
====================== */

// Add sweet
router.post("/", auth, admin, addSweet);

// Update sweet
router.put("/:id", auth, admin, updateSweet);

// Delete sweet
router.delete("/:id", auth, admin, deleteSweet);

// ✅ RESTOCK SWEET (ADMIN ONLY)
router.post("/:id/restock", auth, admin, restockSweet);

module.exports = router;
