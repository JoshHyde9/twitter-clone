import React, { Component } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { markNotificationsAsRead } from "../redux/actions/userActions";

// Material-UI
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

// Material-UI Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import Favourite from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

export class Notifications extends Component {
  state = {
    anchorEl: null
  };

  handleOpen = e => {
    this.setState({ anchorEl: e.target });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter(not => !not.read)
      .map(not => not.notificationId);
    this.props.markNotificationsAsRead(unreadNotificationsIds);
  };

  render() {
    dayjs.extend(relativeTime);

    const { notifications } = this.props;
    const anchorEl = this.state.anchorEl;

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter(not => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter(not => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(not => {
          const verb = not.type === "like" ? "Liked" : "Commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColour = not.read ? "primary" : "secondary";
          const icon =
            not.type === "like" ? (
              <Favourite color={iconColour} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColour} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.notificationId} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={`/users/${not.recipient}/post/${not.postId}`}
              >
                {not.sender} {verb} your post {time}.
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>You're all caught up!</MenuItem>
      );

    return (
      <>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </>
    );
  }
}

Notifications.propTypes = {
  markNotificationsAsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

const mapActionsToProps = {
  markNotificationsAsRead
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);
