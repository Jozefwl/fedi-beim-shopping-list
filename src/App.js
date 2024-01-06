import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Footer from "./components/Footer"
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShoppingList from './pages/ShoppingList';
import NotFoundPage from './pages/NoPage';
import EditList from './pages/EditList';
import UserContext from "./components/UserContext";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

//Translation
import { useTranslation } from "react-i18next";
// import { changeLanguage } from "i18next";
// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [token, setToken] = useState(localStorage.getItem('token') || false)
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [appTheme, setAppTheme] = useState(localStorage.getItem("appTheme") || "dark");;
  const selectedTheme = appTheme === 'dark' ? '' : '-light';
  const [t, i18n] = useTranslation("global");

  const debug = true;

  useEffect(() => {
    // Retrieve the language from localStorage or default to 'en'
    const storedLanguage = localStorage.getItem("language") || "en";
    // Change the language of i18next
    i18n.changeLanguage(storedLanguage);
  }, [i18n]);
 
  const handleRegister = async (username, password) => {
    if (loading) {
      window.alert(t("appjs.processingWait"));
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://194.182.91.65:3000/register', {
        username,
        password
      });
  
      if (response.status === 201) {
        window.alert(t("appjs.registerSuccess"));
        handleCloseRegisterModal();
        // Optionally, redirect to login page or log the user in automatically
      }
    } catch (error) {
      console.error('Registration request failed', error);
      let errorMessage = t("errors.registerFailed");
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = t("errors.usernameExists");
        } else if (error.response.status === 500) {
          errorMessage = t("errors.serverError");
        }
      }
      window.alert(errorMessage);
    }
  
    setLoading(false);
  }; 
  
  const handleLogin = async (username, password) => {
    if (loading) { window.alert(t("appjs.loggingInWait")) }; // Prevents function from proceeding if already loading
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
        localStorage.setItem('loginTime', Date.now());
        // Login time for token refresh
        setUsername(username);
        handleCloseModal();
        window.location.reload();
      } else {
        // Handle login errors
        window.alert(t("errors.logingWrongNamePass"));
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login request failed', error);
      let errorMessage = t("errors.logingWrongNamePass");
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = t("errors.wrongPassword");
        } else if (error.response.status === 500) {
          errorMessage = t("errors.serverError");
        }
      }

      window.alert(errorMessage);
    }
    setLoading(false);
  };

  const handleLogout = (tokenexpiry) => {
    setUsername("");
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 
    localStorage.removeItem('loginTime');
    if(tokenexpiry === true){
      window.alert(t("appjs.inactivity"));
    } else {
      window.location.reload();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowLoginModal = () => {
    setShowModal(true);
  };

  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
    setShowModal(false); // Hide login modal if it's open
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };  

  const handleChangeTheme = () => {
    const themeSelection = appTheme === "light" ? "dark" : "light";
    localStorage.setItem("appTheme", themeSelection); // Correctly use localStorage.setItem with key and value
    setAppTheme(themeSelection); // Update the appTheme state
  }
    // Effect to apply the theme to the body tag
    useEffect(() => {
      // Apply the 'body-light' class to the body tag if the theme is light
      if (appTheme === "light") {
        document.body.classList.add("body-light");
      } else {
        document.body.classList.remove("body-light");
      }
  
      // Clean up: Remove the class when the component unmounts
      return () => {
        document.body.classList.remove("body-light");
      };
    }, [appTheme]); // Run the effect when appTheme changes

  // userId for userContext
  let userId;
  if (token) {
    try {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  } catch (error) {
    alert(t("appjs.tokenBad"))
    handleLogout()
  }
  }

// Token refresh function
const refreshToken = async () => {
  try {
    const response = await axios.post('http://194.182.91.65:3000/refreshToken', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Refresh token response:', response); 
    if (response.status === 200) {
      const newToken = response.data.newToken;
      localStorage.setItem('token', newToken);
      localStorage.setItem('loginTime', Date.now()); // Update login time after refreshing token
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    handleLogout(true)
  }
};

useEffect(() => {
  const checkTokenExpiry = () => {
    const loginTime = localStorage.getItem('loginTime');
    if (token && loginTime) {
      const currentTime = Date.now(); 
      const timeElapsed = currentTime - parseInt(loginTime); // Time elapsed since login in milliseconds

      if (timeElapsed >= 1800000) { // 1 800 000 milliseconds = 30 minutes
        refreshToken();
      }
    }
  };

  const interval = setInterval(checkTokenExpiry, 30000); // Check every 30s or 1/2 min
  //console.log("INTREVALLERY"+interval)

  return () => clearInterval(interval);
}, [token]);

  return (
    <Router>
      <UserContext.Provider value={{token, userId}} >
        <div className="App">
          <Navbar
            username={username}
            onLoginClick={handleShowLoginModal}
            onLogoutClick={handleLogout}
            onRegisterClick={handleShowRegisterModal}
            onThemeClick={handleChangeTheme}
            appTheme={appTheme}
          />
          <div className="UnderNavbar">
          <LoginModal isOpen={showModal} onRequestClose={handleCloseModal} onLogin={handleLogin} />
          <RegisterModal isOpen={showRegisterModal} onRequestClose={handleCloseRegisterModal} onRegister={handleRegister} />
          <Routes>
            <Route path="/" element={<HomePage token={token} />} />
            <Route path="/shoppinglist/:shoppingListId" element={<ShoppingList token={token} />} />
            <Route path="/edit/:shoppingListId" element={<EditList token={token} />} />
            <Route path="/create/:isCreation" element={<EditList token={token} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </div>
        </div>
        <Footer></Footer>
      </UserContext.Provider>
    </Router>
  );
};

export default App;