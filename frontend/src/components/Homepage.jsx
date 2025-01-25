import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Homepage.css';
import Contact from './Contact';
import Description from './Description';
import Header from './Header';
import Navbar from './Navbar'

function Homepage() {
  const [showLogin, setShowLogin] = useState(false); 
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () =>  {
    setShowLogin(true);
    setShowSignUp(false); /* It then hides signup if login is clicked */
    navigate('/login');
  };
  
  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false); /* Hides signup if login is clicked */
    navigate('/signup');
  };

  return (
    <div>
      <Navbar />
      <Header />
        <Description />
      <Contact/>
    </div>
  );
}

export default Homepage;
