import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';
import Navbar from './Navbar'
const MainPage = () => {
  return (
    <div>
      <Navbar/>
      <div className="main-page">
        <div className="books-section">
          <h2>Available Books</h2>
          <ul>
            <li>
              <Link to="/books">View All Books</Link>
            </li>
          </ul>
        </div>
        <div className="categories-section">
          <h2>Book Categories</h2>
          <ul>
            <li>
              <Link to="/categories">View All Categories</Link>
            </li>
          </ul>
        </div>
      </div>

    </div>
    
  );
};

export default MainPage;
