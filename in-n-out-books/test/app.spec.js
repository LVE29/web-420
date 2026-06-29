/*
  Leslie Espino
  Assignment 4.2 - Developing a JSON Web Service
  app.spec.js
  Tests for the In-N-Out-Books API routes
*/

const request = require("supertest");
const app = require("../src/app");

describe("Assignment 4.2 API Tests", () => {
  test("Should return an array of books", async () => {
    const response = await request(app).get("/api/books");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("author");
  });

  test("Should return a single book", async () => {
    const response = await request(app).get("/api/books/1");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("author");
  });

  test("Should return a 400 error if the id is not a number", async () => {
    const response = await request(app).get("/api/books/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("type", "error");
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Book ID must be a number");
  });
});
