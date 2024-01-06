import React from 'react';
import i18n from 'i18next';
import '../styles/Footer.css';

function Footer() {

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    //window.location.reload();
  };

  return (
    <footer className="app-footer">
      <p>© 2023 Jozef Waldhauser</p>

      <div className="language-selector">
        <button onClick={() => changeLanguage('en')}><img className="flag" src="https://flagcdn.com/gb.svg" alt="EN" /></button>
        <button onClick={() => changeLanguage('sk')}><img className="flag" src="https://flagcdn.com/sk.svg" alt="SK" /></button>
        <button onClick={() => changeLanguage('pl')}><img className="flag" src="https://flagcdn.com/pl.svg" alt="PL" /></button>
        <button onClick={() => changeLanguage('ua')}><img className="flag" src="https://flagcdn.com/ua.svg" alt="UA" /></button>
        <button onClick={() => changeLanguage('cz')}><img className="flag" src="https://flagcdn.com/cz.svg" alt="CZ" /></button>
      </div>
    </footer>
  );
}

export default Footer;
