import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // to handle cookies
import { axiosInstance } from '../lib/axios';
import Navbar from './Navbar'


const Login = () => {
    const [formData, setFormData] = useState({
        identity: '',
        password: '',
    });
    const navigate = useNavigate();

    // Check if there's a token on page load
    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            navigate('/books'); 
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { identity, password } = formData;
    
        if (!identity || !password) {
            alert('Please fill in both fields');
            return;
        }
    
        try {
            const response = await axiosInstance.post('/users/login', {
                username: identity, 
                password,
            });
    
            // Check if login is successful
            if (response.status === 200) {
                Cookies.set('access_token', response.data.access_token, { expires: 7 }); // Save token
                alert(response.data.message); // Display success message
                navigate('/books'); // Redirect to home
            }
        } catch (error) {
            // Handle error responses from the backend
            if (error.response) {
                const { status, data } = error.response;
    
                if (status === 401 && data.message === "Invalid username") {
                    alert('Invalid username. Please try again.');
                } else if (status === 401 && data.message === "Invalid password") {
                    alert('Invalid password. Please try again.');
                } else {
                    alert('An unexpected error occurred. Please try again.');
                }
                return;
            } else {
                console.error('Error:', error);
                alert('Login failed due to a network error. Please try again.');
                return;
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <div>
            <Navbar/>
            <div className='Login-user'>
            <h2>Login</h2>
            <form className='addUser' onSubmit={handleSubmit}>
                <div className='input'>
                    <label htmlFor='identity'>Username:</label>
                    <input
                        type='text'
                        id='identity'
                        name='identity'
                        value={formData.identity}
                        onChange={handleInputChange}
                        placeholder='Enter username'
                        required
                    />
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='Enter password'
                        required
                    />
                    <button type='submit'>Login</button>
                </div>
            </form>
            <div className='Login'>
                <p>Don't have an account? <a href='/signup'>Sign up</a></p>
            </div>
        </div>
        </div>
        
    );
};

export default Login;
