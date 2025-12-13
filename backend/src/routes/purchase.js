const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  buySweet,
  getMyPurchases,
} = require("../controllers/purchaseController");

router.post("/buy", auth, buySweet);
router.get("/my", auth, getMyPurchases);

module.exports = router;
