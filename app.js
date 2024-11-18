const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Nitesh2000',
    database: 'BookInventory',
    insecureAuth: true
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

const handleValidationErrors = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add a new book (with validation)
app.post('/add', [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('publication_date').isDate().withMessage('Publication date must be a valid date'),
  body('isbn').notEmpty().withMessage('ISBN must be between 10 and 13 characters')
], handleValidationErrors, (req, res) => {
  console.log('Connected add');

  const { title, author, genre, publication_date, isbn } = req.body;
  const query = 'INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, author, genre, publication_date, isbn], (err, result) => {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).json({ message: 'Error adding book' });
    }
    res.json({ message: 'Book added successfully!', bookId: result.insertId });
  });
});


app.get('/books', (req, res) => {
  const query = 'SELECT * FROM Inventory';
  db.query(query, (err, results) => {
    console.log("get", results); 
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ message: 'Error fetching books' });
    }
    res.json(results);
  });
});


app.put('/update/:id', [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('author').optional().notEmpty().withMessage('Author is required'),
  body('genre').optional().notEmpty().withMessage('Genre is required'),
  body('publication_date').optional().isDate().withMessage('Publication date must be a valid date'),
  body('isbn').optional().isLength({ min: 10, max: 13 }).withMessage('ISBN must be between 10 and 13 characters')
], handleValidationErrors, (req, res) => {
  const { id } = req.params;
  console.log('Updating book with ID:', id);
  const { title, author, genre, publication_date, isbn } = req.body;
  
  const updates = [];
  const values = [];
  
  if (title) {
    updates.push('title = ?');
    values.push(title);
  }
  if (author) {
    updates.push('author = ?');
    values.push(author);
  }
  if (genre) {
    updates.push('genre = ?');
    values.push(genre);
  }
  if (publication_date) {
    updates.push('publication_date = ?');
    values.push(publication_date);
  }
  if (isbn) {
    updates.push('isbn = ?');
    values.push(isbn);
  }

  values.push(id); 

  const query = `UPDATE Inventory SET ${updates.join(', ')} WHERE entry_id = ?`;
  
  db.query(query, values, (err) => {
    if (err) {
      console.error('Error updating book:', err);
      return res.status(500).json({ message: 'Error updating book' });
    }
    res.json({ message: 'Book updated successfully!' });
  });
});


app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Inventory WHERE entry_id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting book:', err);
      return res.status(500).json({ message: 'Error deleting book' });
    }
    res.json({ message: 'Book deleted successfully!' });
  });
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
