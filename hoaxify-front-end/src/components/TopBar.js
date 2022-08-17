import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import hoaxify from "../assets/img/hoaxify.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/authActions";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
const TopBar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { isLoggedIn, username, displayName, image } = useSelector((store) => {
    return {
      isLoggedIn: store.isLoggedIn,
      username: store.username,
      displayName: store.displayName,
      image: store.image,
    };
  });
  const onClickLogOutSucces = () => {
    dispatch(logoutSuccess());
  };
  const menuArea = useRef(null);

  useEffect(() => {
    document.addEventListener("click", menuClickTracker);

    return () => {
      document.removeEventListener("click", menuClickTracker);
    };
  },[isLoggedIn]);

  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  let dropdownClass = "dropdown-menu p-0 shadow";
  if (menuVisible) {
    dropdownClass += " show";
  }

  let links = (
    <ul className="navbar-nav ml-auto">
      <Link className="nav-link" to="/login">
        <li>{t("Login")}</li>
      </Link>

      <Link className="nav-link" to="/signup">
        <li>{t("Sign Up")}</li>
      </Link>
    </ul>
  );
  if (isLoggedIn) {
    links = (
      <ul className="navbar-nav ml-auto" ref={menuArea}>
        {" "}
        <li className="nav-item dropdown">
          <div
            onClick={() => {
              setMenuVisible(true);
            }}
            className="d-flex"
            style={{ cursor: "pointer" }}
          >
            <ProfileImageWithDefault
              image={image}
              className="rounded-circle m-auto"
              width="32px"
              height="32px"
            />
            <span className="nav-link dropdown-toggle">{displayName}</span>
          </div>
          <div className={dropdownClass}>
            <span>
              <Link
              onClick={()=>{
                setMenuVisible(false)
              }}
                className="dropdown-item d-flex p-2"
                to={`/users/${username}`}
              >
                <i className="material-icons text-info mr-2">person</i>
                {t("My Profile")}
              </Link>{" "}
              <Link className="dropdown-item d-flex p-2"
              onClick={onClickLogOutSucces}
              to="/">
                <i className="material-icons text-danger mr-2">
                  power_settings_new
                </i>
                <span >{t("Logout")}</span>
              </Link>
            </span>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className="shadow-sm bg-light mb-2">
      <nav className="navbar navbar-light  container navbar-expand">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src={hoaxify} width="60" alt="hoaxify logo" />
            Hoaxify
          </Link>
          {links}
        </div>
      </nav>
    </div>
  );
};

export default TopBar;
