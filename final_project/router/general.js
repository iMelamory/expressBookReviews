const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // If username doesn't exist, create a new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    // Filter books by author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);  // Return books by the specified author
  } else {
    res.status(404).json({message: "Books by author not found"});  // Return 404 if no books found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    // Filter books by title
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);  // Return books by the specified title
  } else {
    res.status(404).json({message: "Books by author not found"});  // Return 404 if no books found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;  // Retrieve the ISBN from the request parameters
    const book = books[isbn];      // Find the book with the given ISBN
  
    if (book) {
      const reviews = book.reviews;  // Get the reviews object from the book
      res.json(reviews);             // Return the reviews as JSON response
    } else {
      res.status(404).json({message: "Book not found"});  // Return 404 if book not found
    }
  });

module.exports.general = public_users;
