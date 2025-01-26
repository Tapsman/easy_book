# easyBook - Library Management System
## Description

easyBook is a library management system that allows users to borrow and return books in advance. It features role-based access, a functional database, and seamless integration between the frontend and backend.

## Project Structure

easyBook/ 
    └── backend/ 
    │   ├── venv/ # Virtual environment 
    │   ├── app.py # Flask backend application 
    │   └── database.sql # Database structure SQL file 
    └── frontend/ 
        ├── src/ # React source files 
        ├── package.json # React dependencies 
        └── public/ # Static files


## Technologies Used

- Frontend: React
- Backend: Flask
- Database: MySQL

## Setup

### 1. Backend Setup

1. Navigate to the `backend` folder:
cd backend

2. Set up a virtual environment:
python3 -m venv venv


3. Activate the virtual environment:
- On Windows:
  ```
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```
  source venv/bin/activate
  ```

4. Install required dependencies:
    pip install -r req.txt


5. Import the database structure from `database.sql` into MySQL:
- Run the SQL file to set up the database.

6. Start the Flask app:
python app.py


The backend should now be running on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the `frontend` folder:
cd frontend


2. Install frontend dependencies:
npm install

3. Run the React development server:
npm run dev

The frontend should now be running on `http://localhost:5173/`.

## Usage

- Once both the frontend and backend are running, you can use the easyBook system in your browser.
- Users can borrow and return books, while different roles will see specific features based on their access.

## Future Improvements

- Add search functionality for books.
- Implement user notifications for overdue books.
- Improve security for role-based access.

## License
Loay abassi - abassi.loay@gmail.com