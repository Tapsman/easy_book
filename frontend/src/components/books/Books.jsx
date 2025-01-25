import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import "../../styles/Books.css";
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'; // Import Link

const Books = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [role, setRole] = useState("user"); // Default role
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/books/list?page=${page}&limit=10`);

      if (response.data && Array.isArray(response.data.books)) {
        if (response.data.books.length > 0) {
          setBooks((prevBooks) => [...prevBooks, ...response.data.books]);
        } else {
          setHasMore(false);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.sub) {
          setRole(decoded.sub.role); 
        }
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, [page]);

  const loadMoreBooks = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleDelete = async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/books/delete/${bookId}`);
      if (response.status === 200) {
        setBooks(books.filter((book) => book.id !== bookId));
        alert("Book deleted successfully.");
      }
    } catch (err) {
      setError("Error deleting book.");
      console.error("Error:", err);
    }
  };

  const handleUpdate = (bookId) => {
    navigate(`/books/update/${bookId}`);
  };

  if (loading && books.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="books-container">
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          books.map((book) => (
              <div>

              <div className="book-card">
              <Link key={book.id} to={`/books/${book.id}`} className="book-link">

                <img
                  src={book.image ? `http://127.0.0.1:5000/${book.image}` : "default-image.jpg"}
                  alt={book.title || "Untitled"}
                  className="book-image"
                />
                <div className="book-info">
                  <h3>{book.title || "Untitled"}</h3>
                  <p>{book.description || "No description available."}</p>
                  <p className="quantity">Available: {book.quantity || 0}</p>

                </div>
                </Link>
                <div>
                  {role === "admin" && (
                    <div className="book-actions">
                      <button className="update-button" onClick={() => handleUpdate(book.id)}>
                        Update
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(book.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              </div>
            
          ))
        )}
        {hasMore && !loading && (
          <button className="load-more-button" onClick={loadMoreBooks}>
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Books;
