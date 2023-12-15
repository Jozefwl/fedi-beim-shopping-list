import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import i18next from 'i18next'
import global_en from "./translations/en/global.json"
import global_sk from "./translations/sk/global.json"
import { I18nextProvider, initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: true },
  lng: "en",
  resources: {
  en: {
    global: global_en,
  },
  sk: {
    global: global_sk,
  },
},
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18next={i18next}>
    <App />
    </I18nextProvider>
  </React.StrictMode>
);


