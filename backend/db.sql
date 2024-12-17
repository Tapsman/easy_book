create database if not exists db_library;
use db_library;

-- Users table
drop table if exists users;
CREATE TABLE if not exists users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
drop table if exists books;
CREATE TABLE if not exists books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
drop table if exists transactions;
CREATE TABLE if not exists transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);


