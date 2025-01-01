import React, { useState } from 'react'
import '../styles/Login.css';

const Login = () => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit= (e) => {
        e.preventDefault();
        console.log('Logging in with:', {identity, password});
    }

  return (
    <div className='Login-user'>
        <h2>Login</h2>
        <form className='addUser' onSubmit={handleSubmit}>
            <div className='input'>
                <label htmlFor='identity'>Email or username:</label>
                <input
                    type='text'
                    id='Identity'
                    autoComplete='off'
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder='Enter your email or username'
                    required
                    />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    autoComplete='off'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
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