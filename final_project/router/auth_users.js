const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user =>
    user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: username },
    "fingerprint_customer"
  );

  res.status(200).json({ message: "Login successful", token: token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = req.body.review;

  res.status(200).json({
    message: "Review added successfully",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete books[isbn].reviews[username];

  res.status(200).json({
    message: "Review deleted successfully"
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;