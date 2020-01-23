import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "../types";

// Initial state
const initState = {
  authenticated: false,
  credentials: {},
  likes: [],
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
        ...action.payload
      };
    default:
      return state;
  }
}
