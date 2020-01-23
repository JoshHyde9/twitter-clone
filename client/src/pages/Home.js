import React, { Component } from "react";

// Components
import Post from "../components/Post";
import Profile from "../components/Profile";

// Material-UI
import Grid from "@material-ui/core/Grid";

export class Home extends Component {
  state = {
    posts: null
  };
  componentDidMount() {
    fetch("/posts")
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ posts: data });
      });
  }
  render() {
    let postsMarkup = this.state.posts ? (
      this.state.posts.map((post, key) => <Post key={key} post={post} />)
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

export default Home;
