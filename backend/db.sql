drop database db_library;
create database if not exists db_library;
use db_library;

CREATE TABLE if not exists users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    image VARCHAR(255) ,
    borrowed_books JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table if not exists categories(
	id int auto_increment primary key,
    name varchar(20),
    description varchar(255),
    image varchar(255)
);

-- Books table
CREATE TABLE if not exists books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id int,
    foreign key(category_id) references categories(id)
);

-- Transactions table
drop table transactions;
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
select * from users where role = "admin";
select * from books;
DELETE FROM books where id = 1;
select * from categories;
select * from transactions;

