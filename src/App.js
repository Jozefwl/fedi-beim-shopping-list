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
import axios from "axios";


const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [token, setToken] = useState(localStorage.getItem('token') || false)
  const [loading, setLoading] = useState(false);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  const handleLogin = async (username, password) => {
    if (loading) { window.alert("Logging in, please wait.") }; // Prevents function from proceeding if already loading
    setLoading(true);
    try {
      const response = await axios.post(`http://194.182.91.65:3000/login`, {
        username,
        password
      });

      if (response.status === 200) {
        const token = response.data.userToken;
        // Save the token to local storage
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        // Update the username state
        setUsername(username);
        handleCloseModal();
      } else {
        // Handle login errors
        window.alert('Login failed. Please check your username and password.');
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login request failed', error);
      let errorMessage = "Login failed. Please check your username and password.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized: Incorrect username or password.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      window.alert(errorMessage);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Clear username from localStorage
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <Router>
      <UserContext.Provider value={token}>
        <div className="App">
          <Navbar
            username={username}
            onLoginClick={handleShowModal}
            onLogoutClick={handleLogout}
          />
          <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />

          <Routes>
            <Route path="/" element={<HomePage token={token} />} />
            <Route path="/shoppinglist/:shoppingListId" element={<ShoppingList token={token} />} />
            <Route path="/edit/:shoppingListId" element={<EditList token={token} />} />
            <Route path="/create/:isCreation" element={<EditList token={token} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;