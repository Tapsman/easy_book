import React, { useState } from 'react'
import '../styles/Signup.css';

const Signup = () => {
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='signup-user'>
        <h1>Signup</h1>
        <form className='addUser'>
            <input
            type='text'
            placeholder='Username'
            autoComplete='off'
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
            />
            <input
            type='email'
            placeholder='Email'
            autoComplete='off'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type='password'
            placeholder='Password'
            autoComplete='off'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <input
            type='password'
            placeholder='Confirm Password'
            autoComplete='off'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
            <button type='submit'> Sign Up</button>
        </form>
        <div>
            <p>Already have a Account</p>
            <button type='submit'> Login </button>
        </div>
    </div>
  )
}

export default Signup