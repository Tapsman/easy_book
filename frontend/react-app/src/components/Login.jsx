import React, { useState } from 'react'
import '../styles/Login.css';
import { useAuthStore } from '../store/AuthStore';


const Login = () => {
    const [formData, setFormData] = useState({
        identity: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const identity = form.get('identity');
        const password = form.get('password');

        if (!identity || !password){
            alert('Please fill in both fields');
            return;
        }

        console.log('Logging in with:', {identity, password});
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

  return (
    <div className='Login-user'>
        <h2>Login</h2>
        <form className='addUser' onSubmit={handleSubmit}>
            <div className='input'>
                <label htmlFor='identity'>Email or username:</label>
                <input
                    type='text'
                    id='identity'
                    name='identity'
                    value={formData.identity}
                    onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                    placeholder='Enter email or username'
                    required
                    />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder='Enter password'
                    required
                />
                <button type='submit'>Login</button>
            </div>
        </form>
        <div className='Login'>
            <p>Don't have an account<a href='/signup'>Sign up here</a></p>
        </div>
    </div>
  )
}

export default Login