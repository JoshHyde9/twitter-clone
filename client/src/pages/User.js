import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Material-UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

// Comonents
import Post from "../components/Post";
import StaticProfile from "../components/StaticProfile";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis
});

export class User extends Component {
  state = {
    profile: null
  };

  componentDidMount() {
    const userHandle = this.props.match.params.userHandle;
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

    const postsMarkup = loading ? (
      <p>Loading...</p>
    ) : posts === null ? (
      <p>THERE'S NO GOD DAMN POSTS</p>
    ) : (
      posts.map(post => <Post key={post.postId} post={post} />)
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading....</p>
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
