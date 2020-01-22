import React, { Component } from "react";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { Typography, Link } from "@material-ui/core";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
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
  render() {
    const {
      classes,
      post: {
        content,
        userImage,
        userHandle,
        createdAt,
        likeCount,
        commentCount
      }
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          className={classes.image}
          title="Profile Image"
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component={Link}>
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
          <Typography variant="body1">{content}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Post);
