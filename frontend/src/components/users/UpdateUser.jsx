import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import Navbar from '../Navbar';


const UpdateUser = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Handle image upload
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Fetch user details when the component loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/details/${userId}`);
        setUserData(response.data);
        const [first, last] = response.data.full_name.split(' ');
        setFirstName(first);
        setLastName(last);
        setLoading(false);
      } catch (error) {
        setMessage(error.response ? error.response.data.message : 'Failed to fetch user data');
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message before making request

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);
    if (image) formData.append('image', image);

    try {
      const response = await axiosInstance.put(`/users/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Update failed');
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="update-user-container">
        <h2>Update User</h2>
        {loading ? (
          <p>Loading user data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="input-group">
              <label htmlFor="first-name">First Name:</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="last-name">Last Name:</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="old-password">Old Password:</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="new-password">New Password:</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="image">Image:</label>
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="submit-btn">Update</button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
    
  );
};

export default UpdateUser;
