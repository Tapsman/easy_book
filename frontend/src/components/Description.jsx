import React from "react";
import "../styles/Description.css";

const Description = () => {
  return (
    <div className="description-container">
      <div className="description-left">
        <h2 className="description-title">Why Us</h2>
        <p className="description-text">
        Our goal is to provide a seamless platform where users can easily check the availability of books in their local library. 
        We focus on ensuring that you know when a book is available and when it's not, giving you the opportunity to book it in advance. 
        With a user-friendly interface and real-time updates, we aim to make your library experience hassle-free, reliable, and efficient. 
        Our dedicated team works hard to bring you the most convenient solutions for managing your reading needs.
        </p>
      </div>
      <div className="description-right">
        <img src="description.jpg" alt="Our Goal" />
      </div>
    </div>
  );
};

export default Description;
