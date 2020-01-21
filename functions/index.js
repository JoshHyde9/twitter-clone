const functions = require("firebase-functions");
const express = require("express");
const app = express();

const FBAuth = require("./util/FBAuth");

// Post routes
const { getAllPosts, createPost } = require("./routes/posts");
app.get("/posts", getAllPosts); // Get all posts from DB
app.post("/post", FBAuth, createPost); // Create post

// User routes
const { signUp, login } = require("./routes/users");
app.post("/signup", signUp); // Signup users
app.post("/login", login); // Login users

// Creates API function
// http://www.baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
