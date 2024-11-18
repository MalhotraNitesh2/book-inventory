Backend Setup: book-inventory
Clone the repository:

bash

git clone <repository-link>
cd book-inventory
Install dependencies:


npm install
Configure MySQL database:

Update config.js or .env file with your database credentials:
js

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=book_inventory
Import the database schema:
sql

CREATE DATABASE book_inventory;
USE book_inventory;

CREATE TABLE Inventory (
  entry_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  publication_date DATE,
  isbn VARCHAR(13) UNIQUE NOT NULL
);
Start the backend server:



Node app.js
The backend server will run at http://localhost:1234
