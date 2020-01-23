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
import Typeography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Material-UI Icons
import LocationOn from "@material-ui/icons/LocationOn";
import InsertLink from "@material-ui/icons/InsertLink";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Edit from "@material-ui/icons/Edit";

const styles = theme => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
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

  render() {
    const {
      classes,
      user: {
        credentials: {
          userHandle,
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
              <Tooltip title="Upload profile picture" placement="top">
                <IconButton onClick={this.handleEditPicture} className="button">
                  <Edit color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${userHandle}`}
                color="primary"
                variant="h5"
              >
                @{userHandle}
              </MuiLink>
              <hr />
              {bio && <Typeography variant="body2">{bio}</Typeography>}
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
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typeography variant="body2" align="center">
            No profile found, please login or create an accont.
          </Typeography>
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
      <p>Loading...</p>
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
