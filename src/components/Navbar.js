import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ username, onLoginClick, onLogoutClick }) => {
  return (
    <nav className="navbar">
    
      <div className="navbar-left">
        {username && <h1 className="navbar-text">Welcome {username}</h1>}
        {!username && <h1 className="navbar-text">Please log in</h1>}
      </div>
      <div className="navbar-center">
        <a href="/"><button className="navbar-home">Home</button></a>
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