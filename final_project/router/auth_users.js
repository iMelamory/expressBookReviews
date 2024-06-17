const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" }
];

const isValid = (username)=>{ //returns boolean
 return users.some(user => user.username === username);
};

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
 const { username, password } = req.body; // Extract username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username exists and password matches
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    // Save the token in the session
    req.session.authorization = { accessToken };

    // Return a success message without the token
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const review = req.body.review; // Get the review from the request body
  const username = req.user.username; // Get the username from the session (JWT payload)

  // Check if the book exists
  if (books[isbn]) {
    // Check if reviews exist for the book, if not, create an empty object
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    // Add or modify the review
    books[isbn].reviews[username] = review;

    // Send a success response
    res.status(200).json({ message: "Review added/modified successfully" });
  } else {
    // If the book does not exist, send a 404 error
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]) {
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
