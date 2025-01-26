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
    foreign key(category_id) references categories(id) on delete set null
);

-- Transactions table

CREATE TABLE if not exists transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT ,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE cascade
);

select * from users ;
select * from books;
DELETE FROM books where id = 1;
select * from categories;
select * from transactions;

INSERT INTO users (username, full_name, password, role, image, borrowed_books)
VALUES
('john_doe', 'John Doe', 'password123', 'user', 'john_doe.png', '[]'),
('jane_smith', 'Jane Smith', 'password456', 'user', 'jane_smith.png', '[]'),
('admin_user', 'Admin User', 'admin123', 'admin', 'admin_user.png', '[]'),
('mark_lee', 'Mark Lee', 'password789', 'user', 'mark_lee.png', '[]'),
('linda_jones', 'Linda Jones', 'password321', 'user', 'linda_jones.png', '[]'),
('mary_johnson', 'Mary Johnson', 'password654', 'user', 'mary_johnson.png', '[]'),
('james_brown', 'James Brown', 'password987', 'user', 'james_brown.png', '[]'),
('olivia_white', 'Olivia White', 'password111', 'user', 'olivia_white.png', '[]'),
('robert_taylor', 'Robert Taylor', 'password222', 'user', 'robert_taylor.png', '[]'),
('susan_martin', 'Susan Martin', 'password333', 'user', 'susan_martin.png', '[]'),
('michael_wilson', 'Michael Wilson', 'password444', 'user', 'michael_wilson.png', '[]'),
('charlotte_davis', 'Charlotte Davis', 'password555', 'user', 'charlotte_davis.png', '[]'),
('elizabeth_clark', 'Elizabeth Clark', 'password666', 'user', 'elizabeth_clark.png', '[]'),
('david_lee', 'David Lee', 'password777', 'user', 'david_lee.png', '[]'),
('sofia_moore', 'Sofia Moore', 'password888', 'user', 'sofia_moore.png', '[]'),
('william_hall', 'William Hall', 'password999', 'user', 'william_hall.png', '[]'),
('benjamin_smith', 'Benjamin Smith', 'password1234', 'user', 'benjamin_smith.png', '[]'),
('isabella_smith', 'Isabella Smith', 'password5678', 'user', 'isabella_smith.png', '[]'),
('charles_king', 'Charles King', 'password8765', 'user', 'charles_king.png', '[]'),
('ella_lee', 'Ella Lee', 'password4321', 'user', 'ella_lee.png', '[]');

INSERT INTO categories (name, description, image)
VALUES
('Fiction', 'Books that are based on fictional stories.', 'fiction.png'),
('Non-fiction', 'Books that are based on real events, people, or facts.', 'non_fiction.png'),
('Science', 'Books related to scientific fields and discoveries.', 'science.png'),
('History', 'Books that focus on historical events and periods.', 'history.png'),
('Technology', 'Books related to the tech industry and innovations.', 'technology.png');


INSERT INTO books (title, description, image, quantity, category_id)
VALUES
('The Great Gatsby', 'A novel written by F. Scott Fitzgerald about the Jazz Age in the United States.', 'gatsby.jpg', 5, 1),
('Becoming', 'A memoir by Michelle Obama, former First Lady of the United States.', 'becoming.jpg', 3, 2),
('A Brief History of Time', 'Stephen Hawking’s groundbreaking work on cosmology and black holes.', 'history_of_time.jpg', 2, 3),
('1984', 'A dystopian social science fiction novel by George Orwell.', '1984.jpg', 4, 1),
('The Diary of a Young Girl', 'The famous diary of Anne Frank during World War II.', 'anne_frank.jpg', 5, 4),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari’s exploration of human history.', 'sapiens.jpg', 3, 2),
('The Selfish Gene', 'Richard Dawkins’ influential work on evolutionary biology.', 'selfish_gene.jpg', 3, 3),
('The Art of War', 'An ancient Chinese military treatise by Sun Tzu.', 'art_of_war.jpg', 6, 4),
('The Catcher in the Rye', 'A novel by J.D. Salinger about teenage rebellion.', 'catcher_in_the_rye.jpg', 4, 1),
('The Innovators', 'A history of the people who created the computer and the internet.', 'innovators.jpg', 7, 5),
('To Kill a Mockingbird', 'Harper Lee’s classic novel on racism and injustice.', 'to_kill_a_mockingbird.jpg', 5, 1),
('Educated', 'A memoir by Tara Westover about her journey from a survivalist family to a Ph.D.', 'educated.jpg', 2, 2),
('The Code Breaker', 'A book by Walter Isaacson about the scientist Jennifer Doudna and the CRISPR technology.', 'code_breaker.jpg', 5, 5),
('The Man Who Knew Infinity', 'The biography of the Indian mathematician Srinivasa Ramanujan.', 'man_who_knew_infinity.jpg', 4, 3),
('The Power of Habit', 'A book by Charles Duhigg about the science of habits and how to change them.', 'power_of_habit.jpg', 6, 2),
('The Road', 'A post-apocalyptic novel by Cormac McCarthy.', 'the_road.jpg', 3, 1),
('Fahrenheit 451', 'Ray Bradbury’s dystopian novel about a society that burns books.', 'fahrenheit_451.jpg', 5, 1),
('The Lean Startup', 'A book by Eric Ries on how to start a business and keep it lean and agile.', 'lean_startup.jpg', 7, 5),
('Dune', 'Frank Herbert’s epic science fiction novel about politics and power in the desert planet Arrakis.', 'dune.jpg', 5, 3),
('The Subtle Art of Not Giving a F*ck', 'Mark Manson’s no-nonsense approach to living a good life.', 'subtle_art.jpg', 4, 2);

INSERT INTO transactions (user_id, book_id, status, transaction_date, return_date)
VALUES
(1, 1, 'borrowed', '2025-01-01 10:00:00', NULL),
(2, 2, 'borrowed', '2025-01-02 12:00:00', NULL),
(3, 3, 'borrowed', '2025-01-03 14:00:00', NULL),
(4, 4, 'borrowed', '2025-01-04 16:00:00', NULL),
(5, 5, 'borrowed', '2025-01-05 18:00:00', NULL),
(6, 6, 'borrowed', '2025-01-06 20:00:00', NULL),
(7, 7, 'borrowed', '2025-01-07 22:00:00', NULL),
(8, 8, 'borrowed', '2025-01-08 09:00:00', NULL),
(9, 9, 'borrowed', '2025-01-09 11:00:00', NULL),
(10, 10, 'borrowed', '2025-01-10 13:00:00', NULL),
(11, 11, 'borrowed', '2025-01-11 15:00:00', NULL),
(12, 12, 'borrowed', '2025-01-12 17:00:00', NULL),
(13, 13, 'borrowed', '2025-01-13 19:00:00', NULL),
(14, 14, 'borrowed', '2025-01-14 21:00:00', NULL),
(15, 15, 'borrowed', '2025-01-15 23:00:00', NULL),
(16, 16, 'borrowed', '2025-01-16 10:00:00', NULL),
(17, 17, 'borrowed', '2025-01-17 12:00:00', NULL),
(18, 18, 'borrowed', '2025-01-18 14:00:00', NULL),
(19, 19, 'borrowed', '2025-01-19 16:00:00', NULL),
(20, 20, 'borrowed', '2025-01-20 18:00:00', NULL);

