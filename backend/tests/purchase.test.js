const request = require("supertest");
const app = require("../src/app");
const Sweet = require("../src/models/Sweet");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let token;
let sweetId;

beforeAll(async () => {
  const user = await User.create({
    name: "Test User",
    email: "user@test.com",
    password: "hashedpassword",
    role: "user",
  });

  token = jwt.sign({ id: user._id, role: "user" }, "secret123");

  const sweet = await Sweet.create({
    name: "Peda",
    category: "Indian",
    price: 15,
    quantity: 10,
  });

  sweetId = sweet._id;
});

afterAll(async () => {
  await User.deleteMany();
  await Sweet.deleteMany();
  await mongoose.connection.close();
});

describe("PURCHASE SWEET API", () => {
  it("should decrease quantity when purchased", async () => {
    const res = await request(app)
      .post("/api/purchase/buy")
      .set("Authorization", `Bearer ${token}`)
      .send({ sweetId, quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Purchase successful");

    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(8);
  });
});
