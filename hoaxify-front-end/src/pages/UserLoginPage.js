import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import { useApiProgress } from "../shared/ApiProgress";
import { useDispatch } from "react-redux";
import { loginHandler } from "../redux/authActions";
const UserLoginPage = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setError(undefined);
  }, [username, password]);

  const onClickLogin = async (event) => {
    event.preventDefault();

    const { history } = props;

    let creds = {
      username,
      password,
    };

    const { push } = history;

    setError(undefined);
    try {
      await dispatch(loginHandler(creds));
      push("/");
    } catch (apiError) {
      setError(apiError.response.data.message);
    }
  };

  const { t } = useTranslation();
  const pendingApiCall = useApiProgress("post", "/api/1.0/auth");
  const buttonEnabled = username && password;
  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t("Login")}</h1>
        <Input
          name="username"
          label={t("UserName")}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></Input>

        <Input
          name="password"
          label={t("password")}
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></Input>
        <br />
        {error && <div className="alert alert-danger">{error}</div>}

        <br />
        <div className="text-center">
          <ButtonWithProgress
            onClick={onClickLogin}
            disabled={!buttonEnabled || pendingApiCall}
            pendingApiCall={pendingApiCall}
            text={t("Login")}
          ></ButtonWithProgress>
        </div>
      </form>
    </div>
  );
};

export default UserLoginPage;
