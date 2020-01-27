import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { likePost, unLikePost } from "../redux/actions/dataActions";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";

// Material-UI Icons
import FavouriteBorder from "@material-ui/icons/FavoriteBorder";
import Favourite from "@material-ui/icons/Favorite";

// Util
import ToolTipButton from "../util/ToolTipButton";

const styles = theme => ({
  ...theme.spreadThis
});

export class LikeButton extends Component {
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.postId === this.props.postId)
    ) {
      return true;
    } else {
      return false;
    }
  };
  likePost = () => {
    this.props.likePost(this.props.postId);
  };
  unlikePost = () => {
    this.props.unLikePost(this.props.postId);
  };

  render() {
    const { classes } = this.props;
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <ToolTipButton tip="Like">
          <FavouriteBorder className={classes.like} />
        </ToolTipButton>
      </Link>
    ) : this.likedPost() ? (
      <ToolTipButton tip="Unlike" onClick={this.unlikePost}>
        <Favourite className={classes.like} />
      </ToolTipButton>
    ) : (
      <ToolTipButton tip="Like" onClick={this.likePost}>
        <FavouriteBorder className={classes.like} />
      </ToolTipButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unLikePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likePost,
  unLikePost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(LikeButton));
