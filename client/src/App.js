import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./scss/style.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#01a0b5",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  spreadThis: {
    typography: {
      useNextVariants: true
    },
    form: {
      textAlign: "center"
    },
    image: {
      maxWidth: "100px",
      margin: "20px auto"
    },
    pageTitle: {
      margin: "10px auto",
      fontFamily: "Ubuntu"
    },
    textField: {
      margin: "10px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    },
    route: {
      color: "#008394"
    }
  }
});

export class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;