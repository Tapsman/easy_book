import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; 
import "../styles/navbar.css";

const Navbar = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("access_token");
    setAccessToken(token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken.sub); 
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setAccessToken(null);
    setUserInfo(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>EasyBook</h1>
      </div>
      <ul className="navbar-links">
        {!accessToken && (
          <>
            <li>
              <button onClick={() => navigate("/signup")}>Sign Up</button>
            </li>
            <li>
              <button onClick={() => navigate("/login")}>Login</button>
            </li>
          </>
        )}
        {accessToken && (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li>
              <button onClick={() => navigate("/history")}>Owned Books</button>
            </li>
            {userInfo?.role === "admin" && (
              <li>
                <button onClick={() => navigate("/users")}>List Users</button>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
