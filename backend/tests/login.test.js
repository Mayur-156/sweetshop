jest.setTimeout(20000);


const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

describe("Login API Test", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@sweet.com",
        password: "admin123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

});
