import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username, onLoginClick, onLogoutClick, onRegisterClick }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">

        <div className="navbar-left">
          {username && <h1 className="navbar-text">Welcome {username}</h1>}
          {!username && <h1 className="navbar-text">Please log in</h1>}
        </div>

        <div className="navbar-center-container">
          <div className="navbar-center">
            <button className="navbar-home" onClick={() => navigate('/')}>
              Home
            </button>
          </div>
        </div>

        <div className="navbar-right">
          {username ? (
            <button className="navbar-btn-login" onClick={onLogoutClick}>
              Logout
            </button>
          ) : (
            <>
            <button className="navbar-btn-login" onClick={onLoginClick}>
              Login
            </button>
            <button className="navbar-btn-register" onClick={onRegisterClick}>
              Register
            </button>
          </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
