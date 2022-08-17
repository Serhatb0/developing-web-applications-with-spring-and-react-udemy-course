import * as ACTIONS from './constants'

const defaultState = {
  isLoggedIn: false,
  username: undefined,
  displayName: undefined,
  image: undefined,
  password: undefined,
};

const authReducer = (state = {...defaultState}, action) => {
  if (action.type === ACTIONS.LOGOUT_SUCCESS) {
    return defaultState;
  }
  if(action.type === ACTIONS.LOGİN_SUCCESS){
    return {
      ...action.payload,
      username:action.payload.userName,
      isLoggedIn: true,
    }
  }

  if(action.type === ACTIONS.UPDATE_SUCCES){
    return {
      ...state,
      ...action.payload
      // displayName:action.payload.displayName,
      // image:action.password.image
    }
  }
  return state;
};

export default authReducer
