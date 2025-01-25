import React from "react";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <img
        className="header-image"
        src="header.jpg"
        alt="header"
      />
      <div className="header-button">
        <a href="/signup">
          <button>Book Now</button>

        </a>
      </div>
    </header>
  );
};

export default Header;
