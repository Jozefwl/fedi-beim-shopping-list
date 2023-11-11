// Importing necessary dependencies
import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/LoginModal.css";

// Setting the root element for the modal in the application
Modal.setAppElement("#root");

// Functional component for the Login Modal
const LoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  // State to manage the username input
  const [username, setUsername] = useState("");
  // State to manage the password input
  const [password, setPassword] = useState("");

  // Function to handle the login button click
  const handleLogin = () => {
    // Callback function to pass the username and password to the parent component
    onLogin(username, password);
  };

  // Function to handle changes in the username input
  const handleUsernameChange = (e) => {
    // Updating the state with the new username value
    setUsername(e.target.value);
  };

  // Function to handle changes in the password input
  const handlePasswordChange = (e) => {
    // Updating the state with the new password value
    setPassword(e.target.value);
  };

  // JSX structure for the Login Modal
  return (
    <Modal
      isOpen={isOpen}  // Prop to determine whether the modal is open or closed
      onRequestClose={onRequestClose}  // Callback function to close the modal
      className="modal"  // Class name for styling the modal content
      overlayClassName="overlay"  // Class name for styling the modal overlay
    >
      {/* Close button for the modal */}
      <button className="close-btn" onClick={onRequestClose}>
        X
      </button>
      {/* Content of the modal */}
      <div className="modal-body">
        {/* Input for the username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}  // Input change handler
          className="inputBox"  // Class name for styling the input
        />
        {/* Input for the password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}  // Input change handler
        />
      </div>
      {/* Footer section of the modal */}
      <div className="modal-footer">
        {/* Button to trigger the login functionality */}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </Modal>
  );
};

// Exporting the LoginModal component as the default export
export default LoginModal;
