import React, { useState } from 'react'
import '../styles/Signup.css';
import { useAuthStore } from '../store/AuthStore';


const Signup = () => {
    const { signup } = useAuthStore()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
  
    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('passwords do not match!');
            return;
        }

        signup(formData)
        console.log('Signing up with', formData);
      };

  return (
    <div className='signup-user'>
        <h2>Signup</h2>
        <form className='addUser' onSubmit={handleSubmit}>
            <div className='input'>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value})}
                    placeholder='Enter username'
                    required
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value})} 
                    placeholder='Enter email'
                    required
                    />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    placeholder='Enter password'
                    required
                />
                <label htmlFor='confirm password'>Confirm password:</label>
                <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder='Enter confirm Password'
                    required
                />
                <button type='submit'>Sign Up</button>
            </div>
        </form>
    </div>
  )
}

export default Signup
