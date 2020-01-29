import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Material-UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

// Comonents
import Post from "../components/Post";
import PostSkeleton from "../util/PostSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
import StaticProfile from "../components/StaticProfile";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis
});

export class User extends Component {
  state = {
    profile: null,
    postIdParam: null
  };

  componentDidMount() {
    const userHandle = this.props.match.params.userHandle;
    const postId = this.props.match.params.postId;

    if (postId) {
      this.setState({
        postIdParam: postId
      });
    }

    this.props.getUserData(userHandle);

    axios
      .get(`/user/${userHandle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { posts, loading } = this.props.data;

    console.log(posts);

    const { postIdParam } = this.state;

    const postsMarkup = loading ? (
      <PostSkeleton />
    ) : posts === null ? (
      <p>THERE'S NO GOD DAMN POSTS</p>
    ) : !postIdParam ? (
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      posts.map(post => {
        if (post.postId !== postIdParam) {
          return <Post key={post.postId} post={post} />;
        } else {
          return <Post key={post.postId} post={post} openDialog />;
        }
      })
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

const mapActionsToProps = {
  getUserData
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(User));
