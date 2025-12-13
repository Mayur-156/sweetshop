jest.setTimeout(20000);


const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");


describe("Sweets API Test", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Should fetch all sweets", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
