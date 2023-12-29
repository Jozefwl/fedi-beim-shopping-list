import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import i18next from 'i18next'
import global_en from "./translations/en/global.json";
import global_sk from "./translations/sk/global.json";
import global_ua from "./translations/ua/global.json";
import global_pl from "./translations/pl/global.json";
import global_cz from "./translations/cz/global.json";
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
  pl: {
    global: global_pl, //Thank you szufler for checking my polish translation!
  },
  ua: {
    global: global_ua //Thank you Valentin (Delectros) for providing the ukrainian translation!
  },
  cz: {
    global: global_cz
  }
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


