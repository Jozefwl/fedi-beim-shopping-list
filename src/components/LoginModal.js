import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/LoginModal.css";

Modal.setAppElement("#root");

const LoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    onLogin(username, password);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <button className="close-btn" onClick={onRequestClose}>
        X
      </button>
      <div className="modal-body">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className="inputBox"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="modal-footer">
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;