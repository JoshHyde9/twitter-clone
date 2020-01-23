import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logOutUser, getUserData } from "./redux/actions/userActions";

// Styles
import "./scss/style.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Material-UI
import themeFile from "./util/theme";

// Components
import NavBar from "./components/NavBar";
import AuthRoute from "./util/AuthRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logOutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

export class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <NavBar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
            </Switch>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
