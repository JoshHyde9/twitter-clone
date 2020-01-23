import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";

// Initial state
const initState = {
  authenticated: false,
  credentials: {},
  likes: [],
  loading: false,
  notifications: []
};

export default function(state = initState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
