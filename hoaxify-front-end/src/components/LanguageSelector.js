import React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../api/apiCalls";
import turkisFlag from "../assets/img/turkey-flag-icon-32.png";
import usaFlag from "../assets/img/united-states-of-america-flag-icon-32.png";
 function LanguageSelector(props) {

  const {i18n}= useTranslation();
  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className="container">
      <img
        onClick={() => onChangeLanguage("tr")}
        src={turkisFlag}
        alt="turkis flag"
        style={{ marginRight: "5px", cursor: "pointer" }}
      ></img>
      <img
        onClick={() => onChangeLanguage("en")}
        src={usaFlag}
        alt="usa flag"
        style={{ cursor: "pointer" }}
      ></img>
    </div>
  );
}


export default(LanguageSelector)
