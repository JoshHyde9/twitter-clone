import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { getPost } from "../redux/actions/dataActions";

// Components
import LikeButton from "./LikeButton";

// Util
import ToolTipButton from "../util/ToolTipButton";

// Material-UI
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

// Material-UI Icons
import CloseButton from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

// Styles
const styles = theme => ({
  ...theme.spreadThis,
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    maxWidth: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20,
    backgroundColor: "#192735",
    color: "#ddd"
  },
  closeButton: {
    position: "absolute",
    right: 0,
    marginRight: "20px",
    color: "#ddd"
  },
  expandButton: {
    position: "absolute",
    right: 0,
    marginRight: "20px"
  },
  spinner: {
    textAlign: "center",
    margin: "50px 0"
  },
  userHandles: {
    margin: "10px 10px 0 10px"
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
        <img src={userImage} alt="Profile" className={classes.profileImage} />
        <Grid item sm={14} className={classes.userHandles}>
          {/* TODO: Add nickname */}
          <Typography>Nickname goes here!</Typography>
          <Typography
            component={Link}
            className={classes.handle}
            variant="h6"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
        </Grid>
        <Grid item sm={16}>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" className={classes.createdAt}>
            {dayjs(createdAt).format("HH:mm, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{content}</Typography>
          <LikeButton postId={postId} />
          <span>
            {likeCount} {likeCount === 1 ? "like" : "likes"}{" "}
          </span>
          <ToolTipButton tip="Comments">
            <ChatIcon color="primary" />
          </ToolTipButton>
          <span>
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
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
          maxWidth="md"
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
