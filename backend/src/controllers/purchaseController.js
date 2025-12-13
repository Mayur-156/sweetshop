const Sweet = require("../models/Sweet");
const Purchase = require("../models/Purchase");

// ======================
// BUY SWEET
// ======================
exports.buySweet = async (req, res) => {
  try {
    const { sweetId, quantity } = req.body;

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough quantity available" });
    }

    // 🔽 Reduce quantity
    sweet.quantity -= quantity;
    await sweet.save();

    const totalPrice = sweet.price * quantity;

    const purchase = await Purchase.create({
      user: req.user.id,
      sweet: sweetId,
      quantity,
      totalPrice,
    });

    // ✅ FIX: status 200 + message matches test
    res.status(200).json({
      message: "Purchase successful",
      purchase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET USER PURCHASE HISTORY
// ======================
exports.getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user.id })
      .populate("sweet", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
