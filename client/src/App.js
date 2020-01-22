import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";

// Components
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export class App extends Component {
  render() {
    return (
      <>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </div>
      </>
    );
  }
}

export default App;
