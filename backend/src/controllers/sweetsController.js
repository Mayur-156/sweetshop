const Sweet = require("../models/Sweet");

// ======================
// ADD SWEET (Admin)
// ======================
exports.addSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL SWEETS
// ======================
exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE SWEET (Admin)
// ======================
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE SWEET (Admin)
// ======================
exports.deleteSweet = async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: "Sweet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// RESTOCK SWEET (Admin) ✅ NEW
// ======================
exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += Number(quantity);
    await sweet.save();

    res.status(200).json({
      message: "Sweet restocked successfully",
      sweet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
