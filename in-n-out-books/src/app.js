/*
  Leslie Espino
  Assignment 7.2 - Implementing User Authentication
  In-N-Out-Books JSON Web Service
*/

const express = require("express");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const books = require("../database/books");
const users = require("../database/users");

const app = express();

// These middleware functions allow the API to read incoming request data in JSON or form format.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*******************************************************
 * Landing page route.
 * This gives the project a simple browser homepage while
 * the API endpoints handle JSON data requests.
 *******************************************************/
app.get("/", async (req, res, next) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>In-N-Out-Books</title>
  </head>
  <body>
    <h1>In-N-Out-Books</h1>
    <p>Welcome to the In-N-Out-Books JSON Web Service.</p>
  </body>
  </html>
  `;

  res.send(html);
});

/*******************************************************
 * Returns the complete book collection.
 * This endpoint allows clients to retrieve every book
 * from the application's mock database.
 *******************************************************/
app.get("/api/books", async (req, res, next) => {
  try {
    const allBooks = await books.find();
    res.json(allBooks);
  } catch (err) {
    next(err);
  }
});

/*******************************************************
 * Returns a single book by its ID.
 * This endpoint validates the ID first so the API can
 * return a clear 400 error when the request is invalid.
 *******************************************************/
app.get("/api/books/:id", async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
      return next(createError(400, "Book ID must be a number"));
    }

    const allBooks = await books.find();
    const book = allBooks.find((b) => b.id === bookId);

    if (!book) {
      return next(createError(404, "Book not found"));
    }

    res.json(book);
  } catch (err) {
    next(err);
  }
});

/*******************************************************
 * Adds a new book to the collection.
 * A title is required before the book can be added.
 *******************************************************/
app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;

    if (!newBook.title) {
      return next(createError(400, "Book title is required"));
    }

    const result = await books.insertOne(newBook);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/*******************************************************
 * Updates an existing book by its ID.
 * Validating the ID and title prevents invalid data from
 * being sent to the mock database.
 *******************************************************/
app.put("/api/books/:id", async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
      return next(createError(400, "Input must be a number"));
    }

    const bookToUpdate = req.body;

    if (!bookToUpdate.title) {
      return next(createError(400, "Bad Request"));
    }

    await books.updateOne({ id: bookId }, bookToUpdate);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/*******************************************************
 * Deletes a book from the collection by its ID.
 *******************************************************/
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
      return next(createError(400, "Book ID must be a number"));
    }

    await books.deleteOne({ id: bookId });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
/*******************************************************
 * Login must validate both fields before searching so
 * incomplete requests receive the required 400 response.
 * bcrypt protects the stored password by comparing hashes
 * instead of storing or checking a plain-text password.
 *******************************************************/
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Bad Request"));
    }

    const user = await users.findOne({ email });
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return next(createError(401, "Unauthorized"));
    }

    res.status(200).json({
      message: "Authentication successful",
    });
  } catch (err) {
    // A missing user is treated like a wrong password so the API does not reveal which emails are registered.
    next(createError(401, "Unauthorized"));
  }
});

/*******************************************************
 * Catches requests that do not match a route.
 * This keeps unknown URLs from failing silently and gives
 * clients a clear 404 response.
 *******************************************************/
app.use((req, res, next) => {
  next(createError(404));
});

/*******************************************************
 * Centralized error handler.
 * Keeping error responses in one place makes the API
 * responses consistent across all routes.
 *******************************************************/
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    type: "error",
    status: err.status || 500,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

const port = process.env.PORT || 3000;

// The server only starts when this file is run directly, which keeps Jest tests from starting another server.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
