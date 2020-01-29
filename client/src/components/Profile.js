import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { logOutUser, uploadImage } from "../redux/actions/userActions";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
// Material-UI Icons
import LocationOn from "@material-ui/icons/LocationOn";
import InsertLink from "@material-ui/icons/InsertLink";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Edit from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

// Components
import EditDetails from "./EditDetails";

// Util
import ToolTipButton from "../util/ToolTipButton";
import ProfileSkeleton from "../util/ProfileSkeleton";

const styles = theme => ({
  ...theme.spreadThis,
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
});

export class Profile extends Component {
  handleImageChange = e => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logOutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: {
          userHandle,
          userNickname,
          imageURL,
          bio,
          website,
          location,
          createdAt
        },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageURL} alt="profile" className="profile-image" />
              <input
                type="file"
                name=""
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <ToolTipButton
                tip="Upload Profile Picture"
                onClick={this.handleEditPicture}
                placement="top"
              >
                <Edit color="primary" />
              </ToolTipButton>
            </div>
            <hr />
            <div className="profile-details">
              <Typography variant="h5">{userNickname}</Typography>
              <MuiLink
                component={Link}
                to={`/users/${userHandle}`}
                color="primary"
                variant="h5"
              >
                @{userHandle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2">{bio}</Typography>}
              <hr />
              {location && (
                <>
                  <LocationOn color="primary" /> <span>{location}</span>
                  <hr />
                </>
              )}
              {website && (
                <>
                  <InsertLink color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                  <hr />
                </>
              )}
              <CalendarToday color="primary" />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
            <ToolTipButton
              tip="Logout"
              onClick={this.handleLogout}
              placement="top"
            >
              <KeyboardReturn color="primary" />
            </ToolTipButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login or create an accont.
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              Sign Up
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

Profile.propTypes = {
  logOutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  logOutUser,
  uploadImage
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
