import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { default as HomePage } from './pages/HomePage';
import { default as ShoppingList } from './pages/ShoppingList';
import { default as NotFoundPage } from './pages/NoPage';
import { default as EditList } from './pages/EditList';
import UserContext from "./components/UserContext";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username, password) => {
    // TODO login logic
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
    <Router>
    <UserContext.Provider value={username}>
      <div className="App">
        <Navbar
          username={username}
          onLoginClick={handleShowModal}
          onLogoutClick={handleLogout}
        />
        <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />
        
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shoppinglist/:shoppingListId" element={<ShoppingList username={username} />} />
            <Route path="/edit/:shoppingListId" element={<EditList username={username} />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
        
      </div>
    </UserContext.Provider>
    </Router>
  );
};

export default App;
