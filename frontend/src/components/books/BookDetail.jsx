import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Navbar from '../Navbar';


const BookDetail = () => {
  const { id } = useParams(); 
  console.log(id)
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  
    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar/>
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
        </>
      )}
    </div>
    </div>
    
  );
};

export default BookDetail;
