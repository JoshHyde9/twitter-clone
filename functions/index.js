const functions = require("firebase-functions");
const express = require("express");
const app = express();

const FBAuth = require("./util/FBAuth");

// Post routes
const {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost
} = require("./routes/posts");
app.get("/posts", getAllPosts); // Get all posts from DB
app.post("/post", FBAuth, createPost); // Create post
app.get("/post/:postId", getPost); // Get specific post
app.post("/post/:postId/comment", FBAuth, commentOnPost); // Comment on specific post
app.get("/post/:postId/like", FBAuth, likePost); // Like specific post
app.get("/post/:postId/unlike", FBAuth, unlikePost);

// User routes
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./routes/users");
app.post("/signup", signUp); // Signup users
app.post("/login", login); // Login users
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user/", FBAuth, getAuthenticatedUser);

// Creates API function
// http://www.baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
