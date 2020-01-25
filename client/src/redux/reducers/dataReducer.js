import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  LOADING_DATA,
  DELETE_POST,
  CREATE_POST,
  SET_POST,
  CREATE_COMMENT
} from "../types";

const initState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    case LIKE_POST:
    case UNLIKE_POST: {
      let index = state.posts.findIndex(
        post => post.postId === action.payload.postId
      );
      state.posts[index] = action.payload;
      if (state.post.postId === action.payload.postId) {
        state.post = { ...state.post, ...action.payload };
      }
      return {
        ...state
      };
    }
    case DELETE_POST: {
      let index = state.posts.findIndex(post => post.postId === action.payload);
      let mutatedPosts = state.posts.slice();
      mutatedPosts.splice(index, 1);

      return {
        ...state,
        posts: [...mutatedPosts]
      };
    }
    case CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case CREATE_COMMENT: {
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments]
        }
      };
    }
    default:
      return state;
  }
}
