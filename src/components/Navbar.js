import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ username, onLoginClick, onLogoutClick }) => {
  return (
    <nav className="navbar">
    
      <div className="navbar-left">
        {username && <h1>Welcome {username}</h1>}
        {!username && <h1>Please log in</h1>}
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
    </nav>
  );
};

export default Navbar;