/*
  Leslie Espino
 Assignment 6.2 - Manipulating Data in Your Web Service, Part II
  app.spec.js
  Tests for the In-N-Out-Books API routes
*/

const request = require("supertest");
const app = require("../src/app");

describe("Chapter 5: API Tests", () => {
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

  test("Should update a book and return a 204-status code", async () => {
    const updatedBook = {
      title: "The Hobbit: An Unexpected Journey",
      author: "J.R.R. Tolkien",
    };

    const response = await request(app).put("/api/books/1").send(updatedBook);

    expect(response.status).toEqual(204);
  });

  test("Should return a 400-status code when using a non-numeric id", async () => {
    const updatedBook = {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
    };

    const response = await request(app).put("/api/books/foo").send(updatedBook);

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Input must be a number");
  });

  test("Should return a 400-status code when updating a book with a missing title", async () => {
    const updatedBook = {
      author: "J.R.R. Tolkien",
    };

    const response = await request(app).put("/api/books/1").send(updatedBook);

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Bad Request");
  });

  test("Should delete a book", async () => {
    const response = await request(app).delete("/api/books/1");

    expect(response.status).toBe(204);
  });
});
