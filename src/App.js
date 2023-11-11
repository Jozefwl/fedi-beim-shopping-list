// Importing necessary React components, hooks, and styles
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

// App function component
const App = () => {
  // State hooks to manage modal visibility and username
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");

  // Function to handle login logic
  const handleLogin = (username, password) => {
    // Placeholder for login logic (to be implemented)
    console.log(`Logged in as ${username}`);
    setUsername(username);
    handleCloseModal();
  };

  // Function to handle logout
  const handleLogout = () => {
    setUsername("");
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to show the login modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Nested Routes component for defining the application's routes
  const Routes = () => {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/shoppinglist/:shoppingListId">
            <ShoppingList username={username} />
          </Route>
          <Route path="/shoppinglist/:shoppingListId/edit">
            <EditList />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    )
  }

  // Main App component structure
  return (
    // Providing the username value to the UserContext
    <UserContext.Provider value={username}>
      <div className="App">
        {/* Rendering the Navbar component with necessary props */}
        <Navbar
          username={username}
          onLoginClick={handleShowModal}
          onLogoutClick={handleLogout}
        />
        {/* Rendering the LoginModal component with necessary props */}
        <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />
        {/* Rendering the nested Routes component */}
        <Routes></Routes>
      </div>
    </UserContext.Provider>
  );
};

// Exporting the App component as the default export
export default App;
