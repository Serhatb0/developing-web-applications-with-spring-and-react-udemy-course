import LanguageSelector from "../components/LanguageSelector";
import HomePage from "../pages/HomePage";
import UserLoginPage from "../pages/UserLoginPage";
import UserPage from "../pages/UserPage";
import UserSignupPage from "../pages/UserSignupPage";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useSelector } from "react-redux";
function App(props) {
  const {isLoggedIn} = useSelector((store)=>{
    return{
      isLoggedIn: store.isLoggedIn,
    }
  })
  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          {" "}
          <Route exact path="/" component={HomePage} />
          {!isLoggedIn && <Route path="/login" component={UserLoginPage} />}
          <Route path="/signup" component={UserSignupPage} />
          <Route path="/users/:username" component={UserPage} />
          <Redirect to="/" />
        </Switch>
      </Router>

      <LanguageSelector />
    </div>
  );
}

export default (App);
