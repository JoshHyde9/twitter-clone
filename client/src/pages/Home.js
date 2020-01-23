import React, { Component } from "react";
import PropTypes from "prop-types";

// Components
import Post from "../components/Post";
import Profile from "../components/Profile";

// Redux
import { connect } from "react-redux";
import { getPosts } from "../redux/actions/dataActions";

// Material-UI
import Grid from "@material-ui/core/Grid";

export class Home extends Component {
  componentDidMount() {
    this.props.getPosts();
  }
  render() {
    const { posts, loading } = this.props.data;

    let postsMarkup = !loading ? (
      posts.map((post, key) => <Post key={key} post={post} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getPosts })(Home);
