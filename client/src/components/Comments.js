import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import {} from "../redux/actions/dataActions";

// Material-UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: "80px",
    height: "80px",
    ObjectFit: "cover",
    borderRadius: "50%"
  }
});

export class Comments extends Component {
  render() {
    const { classes, comments } = this.props;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { content, userImage, userHandle, createdAt } = comment;
          return (
            <Fragment>
              <Grid item sm={10}>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography variant="h5">Nickname</Typography>
                      <Typography
                        className={classes.handle}
                        variant="subtitle"
                        component={Link}
                        to={`/users/${userHandle}`}
                      >
                        @{userHandle}
                      </Typography>
                      <Typography variant="body2" className={classes.createdAt}>
                        {dayjs(createdAt).format("HH:mm, DD MMMM YYYY")}
                      </Typography>
                      <hr className={classes.invisibleSeparator} />
                      <Typography variant="body1">{content}</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

const mapStateToProps = state => ({});

const mapActionsToState = {};

export default connect(
  mapStateToProps,
  mapActionsToState
)(withStyles(styles)(Comments));
