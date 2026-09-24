import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationNL from "./locales/nl/translation.json";
import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";
import inputSheetNL from "./locales/nl/input_sheet.json";
import inputSheetEN from "./locales/en/input_sheet.json";
import inputSheetFR from "./locales/fr/input_sheet.json";
import dossierInfoNL from "./locales/nl/dossier_info.json";
import dossierInfoEN from "./locales/en/dossier_info.json";
import dossierInfoFR from "./locales/fr/dossier_info.json";
import eventCardNL from "./locales/nl/eventCard.json";
import eventCardEN from "./locales/en/eventCard.json";
import eventCardFR from "./locales/fr/eventCard.json";

const resources = {
  nl: {
    translation: translationNL,
    input_sheet: inputSheetNL,
    dossier_info: dossierInfoNL, //specifieke namespace voor dossier info, zodat we die makkelijk kunnen importeren in dossier componenten
    eventData: eventCardNL
  },
  en: {
    translation: translationEN,
    input_sheet: inputSheetEN,
    dossier_info: dossierInfoEN,
    eventData: eventCardEN
  },
  fr: {
    translation: translationFR,
    input_sheet: inputSheetFR,
    dossier_info: dossierInfoFR,
    eventData: eventCardFR
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // standaardtaal
  fallbackLng: "nl",
  showSupportNotice: false, //nodig, anders irritante melding in console

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
