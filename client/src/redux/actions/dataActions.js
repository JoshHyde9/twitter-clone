import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  CREATE_POST,
  CREATE_COMMENT,
  LOADING_UI,
  SET_POST,
  STOP_LOADING_UI
} from "../types";
import axios from "axios";

const API_URL = "https://asia-east2-twitter-clone-c02fa.cloudfunctions.net/api";

export const getPosts = () => dispatch => {
  dispatch({ type: LOADING_DATA });

  axios
    .get(`${API_URL}/posts`)
    .then(res => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};

export const getPost = postId => dispatch => {
  dispatch({ type: LOADING_UI });

  axios
    .get(`${API_URL}/post/${postId}`)
    .then(res => {
      dispatch({ type: SET_POST, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => {
      console.error(err);
    });
};

export const createPost = newPost => dispatch => {
  dispatch({ type: LOADING_UI });

  axios
    .post(`${API_URL}/post`, newPost)
    .then(res => {
      dispatch({
        type: CREATE_POST,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const likePost = postId => dispatch => {
  axios
    .get(`${API_URL}/post/${postId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      });
    })
    .catch(err => {
      console.error(err);
    });
};

export const unLikePost = postId => dispatch => {
  axios
    .get(`${API_URL}/post/${postId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      });
    })
    .catch(err => {
      console.error(err);
    });
};

export const deletePost = postId => dispatch => {
  axios
    .delete(`${API_URL}/post/${postId}`)
    .then(() => {
      dispatch({ type: DELETE_POST, payload: postId });
    })
    .catch(err => {
      console.error(err);
    });
};

export const createComment = (postId, commentData) => dispatch => {
  axios
    .post(`${API_URL}/post/${postId}/comment`, commentData)
    .then(res => {
      dispatch({ type: CREATE_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });

  axios
    .get(`${API_URL}/user/${userHandle}`)
    .then(res => {
      dispatch({ type: SET_POSTS, payload: res.data.posts });
    })
    .catch(err => {
      console.error(err);
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
