const request = require("supertest");
const app = require("../src/app");
const Sweet = require("../src/models/Sweet");
const mongoose = require("mongoose");

beforeAll(async () => {
  await Sweet.deleteMany();
  await Sweet.create([
    { name: "Ladoo", category: "Indian", price: 10, quantity: 20 },
    { name: "Barfi", category: "Indian", price: 25, quantity: 15 },
  ]);
});

afterAll(async () => {
  await Sweet.deleteMany();
  await mongoose.connection.close();
});

describe("SEARCH SWEETS API", () => {
  it("should search sweets by name", async () => {
    const res = await request(app).get("/api/sweets/search?name=Ladoo");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Ladoo");
  });

  it("should filter sweets by price range", async () => {
    const res = await request(app).get(
      "/api/sweets/search?minPrice=20&maxPrice=30"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Barfi");
  });
});
