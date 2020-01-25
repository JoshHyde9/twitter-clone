import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { createComment } from "../redux/actions/dataActions";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  ...theme.spreadThis
});

export class CommentForm extends Component {
  state = {
    content: "",
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
      if (!nextProps.UI.errors && !nextProps.UI.loading) {
        this.setState({ content: "" });
      }
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.createComment(this.props.postId, {
      content: this.state.content
    });

    this.setState({ content: "", errors: {} });
  };
  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = authenticated ? (
      <Grid item={12} style={{ textAlign: "center" }}>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <TextField
            name="content"
            type="text"
            label="Comment something..."
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.content}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button type="submit" variant="contained" color="primary">
            Comment
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;

    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  createComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  UI: state.UI
});

const mapActionsToProps = {
  createComment
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(CommentForm));
