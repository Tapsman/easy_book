import React, { useState } from 'react'
import '../styles/Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        console.log('Signing up with', {username, email, password });
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
                    autoComplete='off'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter yor username'
                    required
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    autoComplete='off'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Enter your email'
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
                <label htmlFor='confirm password'>Confirm password:</label>
                <input
                    type='password'
                    id='confirm password'
                    autoComplete='off'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Enter your confirm Password'
                    required
                />
                <button type='submit'> Sign Up</button>
            </div>
        </form>
    </div>
  )
}

export default Signup