/*
  Leslie Espino
  Assignment 3.2 - Building Your Own Web Server
  app.js
  In-N-Out-Books Express Server
*/

const express = require("express");
const createError = require("http-errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>In-N-Out-Books</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      header {
        background-color: #6b2737;
        color: white;
        text-align: center;
        padding: 30px;
      }

      main {
        max-width: 900px;
        margin: 30px auto;
        padding: 20px;
      }

      section {
        background: white;
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      h1 {
        margin-bottom: 10px;
      }

      h2 {
        color: #6b2737;
      }

      footer {
        text-align: center;
        background-color: #6b2737;
        color: white;
        padding: 15px;
      }

      ul {
        line-height: 1.6;
      }

      p {
        line-height: 1.6;
      }
    </style>
  </head>

  <body>
    <header>
      <h1>In-N-Out-Books</h1>
      <p>
        Welcome to In-N-Out-Books, your online destination for discovering
        bestselling books, exploring new authors, and finding your next great read.
      </p>
    </header>

    <main>
      <section>
        <h2>Top Selling Books</h2>
        <ul>
          <li>Atomic Habits by James Clear</li>
          <li>Fourth Wing by Rebecca Yarros</li>
          <li>Great Big Beautiful Life by Emily Henry</li>
        </ul>
      </section>

      <section>
        <h2>Hours of Operation</h2>
        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
        <p>Saturday: 10:00 AM - 4:00 PM</p>
        <p>Sunday: Closed</p>
      </section>

      <section>
        <h2>Contact Information</h2>
        <p>Email: support@innoutbooks.com</p>
        <p>Phone: (555) 555-0123</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 In-N-Out-Books</p>
    </footer>
  </body>
  </html>
  `;

  res.send(html);
});

app.use((req, res, next) => {
  next(createError(404));
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
