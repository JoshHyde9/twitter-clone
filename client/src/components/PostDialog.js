import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { getPost } from "../redux/actions/dataActions";

// Util
import ToolTipButton from "../util/ToolTipButton";

// Material-UI
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

// Material-UI Icons
import CloseButton from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

// Styles
const styles = theme => ({
  ...theme.spreadThis,
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    right: 0,
    marginRight: "20px"
  },
  expandButton: {
    position: "absolute",
    right: 0,
    marginRight: "20px"
  },
  spinner: {
    textAlign: "center",
    margin: "50px 0"
  }
});

export class PostDialog extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
    this.props.getPost(this.props.postId);
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };
  render() {
    const {
      classes,
      post: {
        postId,
        content,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle
      },
      UI: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinner}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("HH:mm, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{content}</Typography>
        </Grid>
      </Grid>
    );
    return (
      <>
        <ToolTipButton
          tip="Read More"
          onClick={this.handleOpen}
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </ToolTipButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <ToolTipButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseButton />
          </ToolTipButton>

          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

PostDialog.propTypes = {
  getPost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.data.post,
  UI: state.UI
});

const mapActionsToProps = {
  getPost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostDialog));
