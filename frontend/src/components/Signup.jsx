import React, { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import Navbar from './Navbar'


const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        image: null,
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('password', formData.password);
            data.append('role', formData.role);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axiosInstance.post('/users/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Response:', response.data);
            alert('User registered successfully!');

            // Login after successful registration
            const loginResponse = await axiosInstance.post('/users/login', {
                username: formData.username,
                password: formData.password,
            });

            if (loginResponse.status === 200) {
                Cookies.set('access_token', loginResponse.data.access_token, { expires: 7 });
                navigate('/'); // Redirect to home page after login
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="signup-user">
            <h2>Signup</h2>
            <form className="addUser" onSubmit={handleSubmit}>
                <div className="input">
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Enter first name"
                        required
                    />
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        type="text"
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Enter last name"
                        required
                    />
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter username"
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm password"
                        required
                    />
                    <label htmlFor="image">Profile Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                    <button type="submit">Sign Up</button>
                    <div className='Login'>
                        <p>have an account? <a href='/login'>Sign in</a></p>
                    </div>
                </div>
            </form>
        </div>
        </div>

    );
};

export default Signup;
