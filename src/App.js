import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import "./styles/App.css";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
    <UserContext.Provider value={username}>
      <div className="App">
        <Navbar
          username={username}
          onLoginClick={handleShowModal}
          onLogoutClick={handleLogout}
        />
        <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />
        <Router>
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Route path="/shoppinglist/:shoppingListId">
              <ShoppingList username={username} />
            </Route>
            <Route path="/edit/:shoppingListId">
              <EditList />
            </Route>
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
        </Router>
      </div>
    </UserContext.Provider>
  );
};

export default App;
