import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting bookId from URL
import { axiosInstance } from "../../lib/axios"; // Import your custom axios instance
import "../../styles/UpdateBook.css"; // Import your CSS

const UpdateBook = () => {
  const { bookId } = useParams(); // Get the bookId from the URL params
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState(""); // Category
  const [categories, setCategories] = useState([]); // Categories list
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the book data from the server
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/books/${bookId}`); // Use the custom axios instance
        const book = response.data;

        setTitle(book.title);
        setDescription(book.description);
        setQuantity(book.quantity);
        setCategory(book.category_name || ""); // Set category
        // Optionally handle image (you might not want to display it here)
      } catch (error) {
        setMessage("Error fetching book details.");
        console.error("Error:", error.response?.data || error.message);
      }
    };

    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/list"); // Example endpoint for categories
        setCategories(response.data.categories); // Assuming you have categories list
      } catch (error) {
        setMessage("Error fetching categories.");
        console.error("Error:", error.response?.data || error.message);
      }
    };

    fetchBook();
    fetchCategories();
  }, [bookId]);

  // Handle form field changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  // Handle form submission to update the book
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("category", category); // Add category to formData
    formData.append("image", imageFile); // Add image

    setLoading(true);

    try {
      const response = await axiosInstance.put(`/books/update/${bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setMessage("Error updating book.");
      console.error("Error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="update-book-container">
      <h2>Update Book</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={handleQuantityChange} min="1" required />
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
