import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username, onLoginClick, onLogoutClick }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">

        <div className="navbar-left">
          {username && <h1 className="navbar-text">Welcome {username}</h1>}
          {!username && <h1 className="navbar-text">Please log in</h1>}
        </div>


        <div className="navbar-center">
          <button className="navbar-home" onClick={() => navigate('/')}>
            Home
          </button>

        </div>

        <div className="navbar-right">
          {username && (
            <button className="navbar-btn" onClick={onLogoutClick}>
              Logout
            </button>
          )}
          {!username && (
            <button className="navbar-btn" onClick={onLoginClick}>
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
