import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";

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

let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href("/login");
    authenticated = false;
  } else {
    authenticated = true;
  }
}

export class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <AuthRoute
              exact
              path="/login"
              component={Login}
              authenticated={authenticated}
            />
            <AuthRoute
              exact
              path="/signup"
              component={Signup}
              authenticated={authenticated}
            />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
