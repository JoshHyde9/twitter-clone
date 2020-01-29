import React from "react";
import PropTypes from "prop-types";
import NoImg from "../images/no-img.png";

// Material-UI
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  ...theme.spreadThis,
  userNickname: {
    width: 130,
    height: 20,
    marginBottom: 7,
    backgroundColor: "rgba(255,255,255, 0.7)"
  },
  userHandle: {
    width: 60,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 7
  },
  fullWidth: {
    height: 15,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10
  },
  halfWidth: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10
  },
  centre: {
    margin: "auto",
    width: "50%"
  }
});

const ProfileSkeleton = props => {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt="Profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={classes.centre}>
            <div className={classes.userNickname} />
            <div className={classes.userHandle} />
            <hr />
            <div className={classes.fullWidth} />
            <hr />
            <div className={classes.halfWidth}></div>
            <hr />
            <div className={classes.halfWidth}></div>
            <hr />
            <div className={classes.halfWidth}></div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);
