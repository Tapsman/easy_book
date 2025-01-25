import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Feel free to reach out to us for any queries or support!</p>

      <div className="contact-info">
        <div className="contact-item">
          <strong>Email:</strong>
          <span>contact@easybook.com</span>
        </div>

        <div className="contact-item">
          <strong>Phone:</strong>
          <span>+216 58 171 511</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
