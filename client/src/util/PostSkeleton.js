import React from "react";
import PropTypes from "prop-types";
import NoImg from "../images/no-img.png";

// Material-UI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  ...theme.spreadThis,
  card: {
    display: "flex",
    marginBottom: 20,
    backgroundColor: "#192735"
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25
  },
  cover: {
    minWidth: 200,
    objectFit: "cover"
  },
  userNickname: {
    width: 130,
    height: 20,
    marginBottom: 7,
    backgroundColor: "rgba(255,255,255, 0.7)"
  },
  userHandle: {
    width: 60,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 7
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10
  },
  fullWidth: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10
  },
  halfWidth: {
    height: 15,
    width: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10
  }
});

const PostSkeleton = props => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((item, index) => (
    <Card className={classes.card} key={index}>
      <CardMedia className={classes.cover} image={NoImg} />
      <CardContent className={classes.cardContent}>
        <div className={classes.userNickname} />
        <div className={classes.userHandle} />
        <div className={classes.date} />
        <div className={classes.fullWidth} />
        <div className={classes.fullWidth} />
        <div className={classes.halfWidth} />
      </CardContent>
    </Card>
  ));

  return <>{content}</>;
};

PostSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PostSkeleton);
