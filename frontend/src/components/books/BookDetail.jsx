import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; 
import "../../styles/BookDetail.css"

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [borrowError, setBorrowError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (id) {
        try {
          const response = await axiosInstance.get(`/books/${id}`);
          setBook(response.data);
        } catch (err) {
          setError("Error fetching book details.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid book ID.");
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        const decodedToken = jwtDecode(token); 
        const userId = decodedToken.sub.id; 

        try {
          const response = await axiosInstance.get(`/users/details/${userId}`);
          setUser(response.data);
          if (response.data?.borrowed_books) {
            const borrowedBooks = JSON.parse(response.data.borrowed_books);
            if (borrowedBooks?.includes(id)) {
              setIsBorrowed(true);
            }
          }
        } catch (err) {
          setError("Error fetching user details.");
        }
      }
    };

    fetchBookDetails();
    fetchUserDetails();
  }, [id]);

  const handleBorrow = async () => {
    const token = Cookies.get("access_token");
    if (!token) return;

    const decodedToken = jwtDecode(token); // Decode to get user ID
    const userId = decodedToken.sub.id; // Accessing user_id

    try {
      const response = await axiosInstance.post("/books/borrow", {
        user_id: userId, // Pass user ID here
        book_id: id,
      });
      setIsBorrowed(true);
      alert("Book borrowed successfully!");
    } catch (err) {
      setBorrowError("Error borrowing the book.");
    }
  };

  const handleReturn = async () => {
    const token = Cookies.get("access_token");
    if (!token) return;

    const decodedToken = jwtDecode(token); // Decode to get user ID
    const userId = decodedToken.sub.id; // Accessing user_id using decodedToken.sub.id

    try {
      const response = await axiosInstance.post("/books/return", {
        user_id: userId, // Pass user ID here
        book_id: id,
      });
      setIsBorrowed(false);
      alert("Book returned successfully!");
    } catch (err) {
      setBorrowError("Error returning the book.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <a href="/books" className="back-button">
        &#8592; Back to Books
      </a>
      <div className="book-detail-container">
        {book && (
          <>
            <h2>{book.title}</h2>
            <img
              src={book.image ? `http://127.0.0.1:5000/${book.image}` : "default-image.jpg"}
              alt={book.title || "Untitled"}
              className="book-image"
            />
            <p>{book.description}</p>
            <p className="quantity">Available: {book.quantity}</p>

            {user && (
              <div>
                {isBorrowed ? (
                  <button onClick={handleReturn}>Return Book</button>
                ) : (
                  <button onClick={handleBorrow}>Borrow Book</button>
                )}
                {borrowError && <p>{borrowError}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
