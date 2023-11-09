import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import "./styles/App.css";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username, password) => {
    // handle login logic here
    console.log(`Logged in as ${username}`);
    setUsername(username);
    handleCloseModal();
  };

  const handleLogout = () => {
    setUsername("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div className="App">
      <Navbar
        username={username}
        onLoginClick={handleShowModal}
        onLogoutClick={handleLogout}
      />

      <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />
    </div>
  );
};

export default App;