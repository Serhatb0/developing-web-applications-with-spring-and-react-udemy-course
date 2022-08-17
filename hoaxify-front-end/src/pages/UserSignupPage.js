import React, { useState } from "react";
import Input from "../components/Input";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import withApiProgress, { useApiProgress } from "../shared/ApiProgress";
import { useDispatch } from "react-redux";
import { signupHandler } from "../redux/authActions";

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    userName: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    const errorsCopy = { ...errors };
    errorsCopy[name] = undefined;
    setErrors((previousError =>{
      return {
        ...previousError,
        [name]:undefined
      }
    }));
    setForm((previousForm) => {
      return {
        ...previousForm,
        [name]: value,
      };
    });
  };

  const onClickSignUp = async (event) => {
    event.preventDefault();
    const { userName, displayName, password } = form;
    const body = {
      userName,
      displayName,
      password,
    };

    try {
      const { history } = props;
      const { push } = history;
      await dispatch(signupHandler(body));
      push("/");
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };

  const {t} = useTranslation();
  const pendingApiCallSignUp  = useApiProgress('post',"/api/1.0/users");
  const pendingApiCallLogin  = useApiProgress('post',"/api/1.0/auth");
  const pendingApiCall = pendingApiCallLogin || pendingApiCallSignUp

  const {
    userName: userNameError,
    displayName: displayNameError,
    password: passwordError,
  } = errors;
  let passwordRepeatError;
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t("Password mismatch");
  }
  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t("Sign Up")}</h1>
        <Input
          name="userName"
          label={t("UserName")}
          error={userNameError}
          onChange={onChange}
        ></Input>
        <Input
          name="displayName"
          label={t("DisplayName")}
          error={displayNameError}
          onChange={onChange}
        ></Input>
        <Input
          name="password"
          label={t("password")}
          error={passwordError}
          onChange={onChange}
          type="password"
        ></Input>
        <Input
          name="passwordRepeat"
          label={t("passwordRepeat")}
          error={passwordRepeatError}
          onChange={onChange}
          type="password"
        ></Input>

        <br />

        <div className="text-center">
          <ButtonWithProgress
            onClick={onClickSignUp}
            disabled={pendingApiCall || passwordRepeatError !== undefined}
            pendingApiCall={pendingApiCall}
            text={t("SignUp")}
          ></ButtonWithProgress>
        </div>
      </form>
    </div>
  );
};



export default(UserSignupPage);
