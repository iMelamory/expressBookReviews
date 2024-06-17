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
public_users.get('/async', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/internal_books');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({ message: 'There was an error fetching the books!', error: error.message });
    }
  });
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const book = await getBookByISBN(isbn);
      res.json({ bookbyisbn: book });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    res.json({ booksbyauthor: booksByAuthor });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const booksByTitle = await getBooksByTitle(title);
      res.json({ booksbytitle: booksByTitle });
    } catch (error) {
      res.status(404).json({ message: error.message });
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
