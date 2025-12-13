jest.setTimeout(20000);


const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

describe("Auth API Tests", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email");
  });

});
