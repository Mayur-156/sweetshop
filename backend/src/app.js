const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const sweetRoutes = require("./routes/sweets");
const purchaseRoutes = require("./routes/purchase");

const app = express();

// ✅ MongoDB connection (IMPORTANT for tests)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/purchase", purchaseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API Running" });
});

module.exports = app;
