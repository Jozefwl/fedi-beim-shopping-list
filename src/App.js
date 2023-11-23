import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShoppingList from './pages/ShoppingList';
import NotFoundPage from './pages/NoPage';
import EditList from './pages/EditList';
import UserContext from "./components/UserContext";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username, password) => {
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
            <Route path="/" element={<HomePage username={username}/>} />
            <Route path="/shoppinglist/:shoppingListId" element={<ShoppingList username={username}/>} />
            <Route path="/edit/:shoppingListId" element={<EditList username={username} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
