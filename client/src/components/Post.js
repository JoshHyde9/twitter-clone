import React, { Component } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
// Material-UI Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavouriteBorder from "@material-ui/icons/FavoriteBorder";
import Favourite from "@material-ui/icons/Favorite";

// Redux
import { connect } from "react-redux";
import { likePost, unLikePost } from "../redux/actions/dataActions";

// Comonents
import DeletePost from "./DeletePost";

// Util
import ToolTipButton from "../util/ToolTipButton";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
    maxHeight: "180px"
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    ObjectFit: "cover"
  }
};

export class Post extends Component {
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.postId === this.props.post.postId)
    ) {
      return true;
    } else {
      return false;
    }
  };
  likePost = () => {
    this.props.likePost(this.props.post.postId);
  };
  unlikePost = () => {
    this.props.unLikePost(this.props.post.postId);
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      post: {
        content,
        userImage,
        userHandle,
        createdAt,
        likeCount,
        commentCount,
        postId
      },
      user: { authenticated }
    } = this.props;
    const handle = this.props.user.credentials.userHandle;
    const likeButton = !authenticated ? (
      <ToolTipButton tip="Like">
        <Link to="/login">
          <FavouriteBorder color="primary" />
        </Link>
      </ToolTipButton>
    ) : this.likedPost() ? (
      <ToolTipButton tip="Unlike" onClick={this.unlikePost}>
        <Favourite color="primary" />
      </ToolTipButton>
    ) : (
      <ToolTipButton tip="Like" onClick={this.likePost}>
        <FavouriteBorder color="primary" />
      </ToolTipButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          className={classes.image}
          title="Profile Image"
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component={Link} to="/users/${userHandle}">
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {content.length > 140
              ? `${content.substring(0, 140)}... Read more`
              : content}
          </Typography>
          {likeButton}
          <span>
            {likeCount} {likeCount === 1 ? "like" : "likes"}{" "}
          </span>
          <ToolTipButton tip="Comments">
            <ChatIcon color="primary" />
          </ToolTipButton>
          <span>
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        </CardContent>
      </Card>
    );
  }
}

Post.propTypes = {
  likePost: PropTypes.func.isRequired,
  unLikePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
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
)(withStyles(styles)(Post));
