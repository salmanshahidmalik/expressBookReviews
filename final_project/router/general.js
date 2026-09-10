const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Internal endpoint for Axios
public_users.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).json({message: "User already exists"});
  }

  users.push({ username, password });
  res.status(200).json({message: "User successfully registered"});
});

// Get all books
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');
    const book = response.data[req.params.isbn];

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    res.status(500).json({message: "Error retrieving book"});
  }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');

    const result = Object.values(response.data).filter(book =>
      book.author.toLowerCase() === req.params.author.toLowerCase()
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/books');

    const result = Object.values(response.data).filter(book =>
      book.title.toLowerCase() === req.params.title.toLowerCase()
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;