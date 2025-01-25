import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios"; // Import your axios instance
import "../../styles/AddBook.css"; // Import the styling
import Navbar from '../Navbar'

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/list");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    

    fetchCategories();
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleCategoryChange = (e) => setCategoryId(e.target.value);
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("category_id", categoryId);
    formData.append("image", imageFile);

    console.log([...formData.entries()]); // Debug to verify the data

    setLoading(true);
    try {
      const response = await axiosInstance.post("/books/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Book added successfully.");
      console.log("Response:", response.data);
    } catch (error) {
      setMessage("Error adding book.");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
        </div>
        <div>
          <label>Category:</label>
          <select value={categoryId} onChange={handleCategoryChange} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddBook;
