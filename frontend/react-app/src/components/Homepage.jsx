import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../styles/Homepage.css';
import headerImage from '../images/pexels-pixabay-256541.jpg';
import poetryImage from '../images/poetry.t.jpg';
import humorImage from '../images/humor.2.jpg';
import actionImage from '../images/action.jpg';

function Homepage() {
  const [showLogin, setShowLogin] = useState(false); 
  const [showSignUp, setShowSignUp] = useState(false);
    const handleLoginClick = () =>  {
      setShowLogin(true);
      setShowSignUp(false); /* It then hides signup if login is clicked */
    };
  
    const handleSignUpClick = () => {
      setShowSignUp(true);
      setShowLogin(false); /* Hides signup if login is clicked */
    };

  return (
    <div>
      <header className="header">
        <div className="header-image">
          <img src={headerImage} alt="Library welcoming image" />
          <div className="message">Welcome to the state of the art Library!</div>
        </div>
        <nav className="nav">
          <button className="btn" onClick={handleLoginClick}>Login</button>
          <button className="btn" onClick={handleSignUpClick}>Sign Up</button>
        </nav>
      </header>
      <main className="categories">
        <Link to="/poetry" className="category">
          <img src={poetryImage} alt="Poetry" />
          Category 1: Poetry
        </Link>
        <Link to="/humor" className="category">
          <img src={humorImage} alt="Humor" />
          Category 2: Humor
        </Link>
        <Link to="/action" className="category">
          <img src={actionImage} alt="Action" />
          Category 3: Action
        </Link>
      </main>
    </div>
  );
}

export default Homepage;
