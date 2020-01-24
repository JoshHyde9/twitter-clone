import React, { Component } from "react";
import PropTypes from "prop-types";

// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

// Material-UI Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

// Util
import ToolTipButton from "../util/ToolTipButton";

// Redux
import { connect } from "react-redux";
import { createPost } from "../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis,
  submitButton: {
    position: "relative",
    marginTop: "5px"
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    right: 0,
    marginRight: "20px"
  }
});

export class CreatePost extends Component {
  state = {
    open: false,
    content: "",
    errors: {}
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.createPost({ content: this.state.content });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ content: "", open: false, errors: {} });
    }
  }

  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <>
        <ToolTipButton tip="Post A Twat" onClick={this.handleOpen}>
          <AddIcon />
        </ToolTipButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <ToolTipButton
            tip="Close"
            onClick={this.handleClose}
            btnClassName={classes.closeButton}
          >
            <CloseIcon />
          </ToolTipButton>
          <DialogTitle>Post A New Twat</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="content"
                type="text"
                label="Create a Twat"
                multiline
                rows="3"
                placeholder="YA YEEEEEEEET"
                error={errors.content ? true : false}
                helperText={errors.content}
                className={classes.TextField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Create
                {loading && (
                  <CircularProgress className={classes.progressSpinner} />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(mapStateToProps, { createPost })(
  withStyles(styles)(CreatePost)
);
