import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/LoginModal.css";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

//Translation

// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const LoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [t] = useTranslation("global")

  const handleLogin = () => {
    onLogin(username, password);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {  // press return key for logging in
      handleLogin();
    }
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
          placeholder={t("appjs.username")}
          value={username}
          onChange={handleUsernameChange}
          className="inputBox"
        />
        <input
          type="password"
          placeholder={t("appjs.password")}
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="modal-footer">
        <button className="login-btn" onClick={handleLogin}>
        {t("appjs.login")}
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;