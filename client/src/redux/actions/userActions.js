import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_AS_READ
} from "../types";

import axios from "axios";

const API_URL = "https://asia-east2-twitter-clone-c02fa.cloudfunctions.net/api";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`${API_URL}/login`, userData)
    .then(res => {
      // Add JWT to localStorage and set axios "Authorization" header to contain JWT
      setAuthorisationHeader(res.data.token);

      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });

      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const signUpUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`${API_URL}/signup`, newUserData)
    .then(res => {
      setAuthorisationHeader(res.data.token);

      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });

      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logOutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];

  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .get(`${API_URL}/user`)
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => {
      console.error(err);
    });
};

export const uploadImage = formData => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post(`${API_URL}/user/image`, formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.error(err);
    });
};

export const editUserDetails = userDetails => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post(`${API_URL}/user`, userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.error(err);
    });
};

export const markNotificationsAsRead = notifcationIds => dispatch => {
  axios
    .post(`${API_URL}/notifications`, notifcationIds)
    .then(res => {
      dispatch({ type: MARK_NOTIFICATIONS_AS_READ });
    })
    .catch(err => {
      console.error(err);
    });
};

const setAuthorisationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  // Set JWT to localStorage
  localStorage.setItem("FBIdToken", FBIdToken);
  // Set axios "Authorization" header to contain JWT
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
