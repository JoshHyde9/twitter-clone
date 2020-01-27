import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Util
import ToolTipButton from "../util/ToolTipButton";

// Components
import CreatePost from "./CreatePost";
import Notifications from "./Notifications";

// Redux
import { connect } from "react-redux";

// Material-UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
// Material-UI Icons
import HomeIcon from "@material-ui/icons/Home";

export class NavBar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <>
              <CreatePost />
              <Link to="/">
                <ToolTipButton tip="Home">
                  <HomeIcon color="primary" />
                </ToolTipButton>
              </Link>
              <Notifications color="primary" />
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(NavBar);
