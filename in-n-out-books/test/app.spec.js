/*
  Leslie Espino
  Assignment 5.2 - Manipulating Data in Your Web Service, Part I
  app.spec.js
  Tests for the In-N-Out-Books API routes
*/

const request = require("supertest");
const app = require("../src/app");

describe("Assignment 5.2 API Tests", () => {
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

  test("Should add a new book", async () => {
    const newBook = {
      id: 6,
      title: "School of Rock",
      author: "Mike White",
    };

    const response = await request(app).post("/api/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.ops[0]).toHaveProperty("id", 6);
    expect(response.body.ops[0]).toHaveProperty("title", "School of Rock");
    expect(response.body.ops[0]).toHaveProperty("author", "Mike White");
  });

  test("Should return a 400 error if the title is missing", async () => {
    const newBook = {
      id: 7,
      author: "Unknown Author",
    };

    const response = await request(app).post("/api/books").send(newBook);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("type", "error");
    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message", "Book title is required");
  });

  test("Should delete a book", async () => {
    const response = await request(app).delete("/api/books/1");

    expect(response.status).toBe(204);
  });
});
