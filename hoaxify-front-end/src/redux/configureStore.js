import { createStore ,applyMiddleware,compose} from "redux";
import SecureLS from "secure-ls";
import authReducer from "./authReducer";
import thunk from "redux-thunk";
import { setAuthorizationHeader } from "../api/apiCalls";
const secureLs = new SecureLS();

const getStateFromStorage = () => {
  const hoaxAuth = secureLs.get("hoax-auth");
  let stateInLocalStorage = {
    isLoggedIn: false,
    username: undefined,
    displayName: undefined,
    image: undefined,
    password: undefined,
  };
  if (hoaxAuth) {
    return hoaxAuth
  }
  return stateInLocalStorage;
};

const updateStateInStorge = (newState) => {
  secureLs.set("hoax-auth", newState);
};

const configureStore = () => {
  const initalState = getStateFromStorage();
  setAuthorizationHeader(initalState);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    authReducer,
    initalState,
    composeEnhancers(applyMiddleware(thunk))
  );

  store.subscribe(() => {
    updateStateInStorge(store.getState());
    setAuthorizationHeader(store.getState());
  });
  return store;
};

export default configureStore;
