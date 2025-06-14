import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcomeMessage: "welcome to react and i18next",
      roomsAvailable: 'Rooms',
    },
  },
  kw: {
    translation: {
      welcomeMessage: "kamau alikimbishwa na ngombe",
      roomsAvailable: 'Nyumba'
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});


const times_backend = {
  create_house: "2.958s",
  refresh: "387.93ms",
};
const frontend_lightHouse = {
  profile: 93,
  home: 78,
  about: 96,
  contact: 95,
  create: 67,
  login: 94,
  signup: 93,
  personal: 67,
  help: 96,
  admin: 41
};


 console.log(times_backend,
frontend_lightHouse)

export default i18n;
