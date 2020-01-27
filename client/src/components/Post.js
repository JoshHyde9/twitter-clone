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

// Redux
import { connect } from "react-redux";

// Comonents
import DeletePost from "./DeletePost";
import PostDialog from "./PostDialog";
import LikeButton from "./LikeButton";

// Util
import ToolTipButton from "../util/ToolTipButton";

const styles = theme => ({
  ...theme.spreadThis,
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
    maxHeight: "200px",
    backgroundColor: "#192735",
    color: "#ddd"
  },
  image: {
    width: "100%",
    maxWidth: "200px",
    ObjectFit: "cover"
  },
  content: {
    padding: 25,
    ObjectFit: "cover"
  }
});

export class Post extends Component {
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
          <Typography variant="h5">Nickname</Typography>
          <Typography
            variant="subtitle2"
            className={classes.handle}
            component={Link}
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" className={classes.createdAt}>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {content.length > 110 ? `${content.substring(0, 110)}...` : content}
          </Typography>
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
          <PostDialog
            postId={postId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Post.propTypes = {
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
