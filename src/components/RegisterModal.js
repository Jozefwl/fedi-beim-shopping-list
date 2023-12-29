import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/LoginModal.css";
import { useTranslation } from "react-i18next";


Modal.setAppElement("#root");

//Translation

// 
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const RegisterModal = ({ isOpen, onRequestClose, onRegister }) => {
  const [t, i18n] = useTranslation("global")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleRegister = () => {
    if (password === confirmPassword) {
      onRegister(username, password);
    } else {
      setPasswordsMatch(false);
      window.alert(t("errors.pwNotMatch"));
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordsMatch) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (!passwordsMatch) {
      setPasswordsMatch(e.target.value === password);
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
        />
        <input
          type="password"
          placeholder={t("appjs.confirmPassword")}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {!passwordsMatch && <div>Passwords do not match!</div>}
      </div>
      <div className="modal-footer">
        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;
