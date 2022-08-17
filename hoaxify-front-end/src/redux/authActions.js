import * as ACTIONS from "./constants";
import {  login, logout, signup } from "../api/apiCalls";

export const logoutSuccess = () => {
  return async function(dispatch){
    try {
      await logout();
    } catch (err){

    }
    dispatch({
      type: ACTIONS.LOGOUT_SUCCESS
    })
  }
};

export const loginSuccess = (authState) => {
  return {
    type: ACTIONS.LOGİN_SUCCESS,
    payload: authState,
  };
};


export const updateSuccess = ({displayName,image}) => {
  return {
    type: ACTIONS.UPDATE_SUCCES,
    payload: {
      displayName,
      image
    },
  };
};
export const loginHandler = (credentials) => {
  return async (dispatch) => {
    const response = await login(credentials);
    const authState = {
      ...response.data.userVM,
      password: credentials.password,
      token: response.data.token
    };
    dispatch(loginSuccess(authState));
    return response;
  };
};

export const signupHandler = (user) => {
  return async (dispatch) => {
    const response = await signup(user);
    const credentials = {
      username: user.userName,
      password: user.password,
    };

    await dispatch(loginHandler(credentials));
    return response;
  };
};
