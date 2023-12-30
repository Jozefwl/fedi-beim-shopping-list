import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

//Translation
import { useTranslation } from "react-i18next";
// const [t, i18n] = useTranslation("global")
// shoppingList, listViewer, listEditor, navbar
// {t("location.access")}
//-----

const Navbar = ({ username, onLoginClick, onLogoutClick, onRegisterClick, onThemeClick }) => {
  const navigate = useNavigate();
  const appTheme = localStorage.getItem("appTheme") || "dark";
  const selectedTheme = appTheme === 'dark' ? '' : '-light';
  const [t, i18n] = useTranslation("global")

  //{`button-default${selectedTheme}`}

  return (
    <nav className={`navbar${selectedTheme}`}>
      <div className="navbar-content">

        <div className="navbar-left">
          {username && <h1 className="navbar-text">{t("navbar.welcome")} {username}</h1>}
          {!username && <h1 className="navbar-text">{t("navbar.plsLogin")}</h1>}
        </div>

        <div className="navbar-center-container">
          <div className="navbar-center">
            <button className="navbar-home" onClick={() => navigate('/')}>
            {t("navbar.home")}
            </button>
          </div>
        </div>

        <div className="navbar-right">
        
            {appTheme === "light" ? <button className="navbar-theme-toggle-light" onClick={onThemeClick}><FaSun /></button> : <button className="navbar-theme-toggle-dark" onClick={onThemeClick}><FaMoon /></button>}
          
          {username ? (
            <button className="navbar-btn-logout" onClick={onLogoutClick}>
              {t("navbar.logout")}
            </button>
          ) : (
            <>
            <button className="navbar-btn-login" onClick={onLoginClick}>
            {t("navbar.login")}
            </button>
            <button className="navbar-btn-register" onClick={onRegisterClick}>
            {t("navbar.register")}
            </button>
          </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
