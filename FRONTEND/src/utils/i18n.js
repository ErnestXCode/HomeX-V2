import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcomeMessage: "welcome to react and i18next",
      RoomsAvailable: "Available Units",
      EditDetails: "Edit Details",
      MarkAsTaken: "Mark as Taken",
      Me: "Me",
      About: "About",
      Home: "Home",
      Create: "Create",
      Location: "Location",
      AverageRent: "Average Rent",
      Version: "Version",
      Donate: "Donate",
      PersonalInfo: "Personal Information",
      ContactUs: "Contact us",
      Help: "Help",
      Shortlists: "Shortlists",
      Posts: "Posts",
      Account: "Account",
      LogOut: "Log out",
      LogIn: "Log in",
      Register: "Register",
      Language: "Language",
      Announcements: "Announcements",
    },
  },
  sw: {
    translation: {
      welcomeMessage: "kamau alikimbishwa na ngombe",
      RoomsAvailable: "Vitengo Vinavyopatikana",
      EditDetails: "Hariri Maelezo",
      MarkAsTaken: "Weka Imechukuliwa",
      Me: "Mimi",
      About: "Habari",
      Home: "Mkuu",
      Create: "Unda",
      Location: "Eneo",
      AverageRent: "Kodi Wastani",
      Version: "Toleo",
      Donate: "Changia",
      PersonalInfo: "Taarifa Binafsi",
      ContactUs: "Wasiliana",
      Help: "Msaada",
      Shortlists: "Chaguo",
      Posts: "Machapisho",
      Account: "Akaunti",
      LogOut: "Ondoka",
      LogIn: "Ingia",
      Register: "Jisajili",
      Language: "Lugha",
      Announcements: "Tangazo",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
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
  admin: 41,
};

console.log(times_backend, frontend_lightHouse);

export default i18n;
