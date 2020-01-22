const functions = require("firebase-functions");
const express = require("express");
const app = express();

const { db } = require("./util/admin");

const FBAuth = require("./util/FBAuth");

// Post routes
const {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost
} = require("./routes/posts");
app.get("/posts", getAllPosts); // Get all posts from DB
app.post("/post", FBAuth, createPost); // Create post
app.get("/post/:postId", getPost); // Get specific post
app.post("/post/:postId/comment", FBAuth, commentOnPost); // Comment on specific post
app.get("/post/:postId/like", FBAuth, likePost); // Like specific post
app.get("/post/:postId/unlike", FBAuth, unlikePost); // Unlike specific post
app.delete("/post/:postId", FBAuth, deletePost); // Delete specific post

// User routes
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsAsRead
} = require("./routes/users");
app.post("/signup", signUp); // Signup users
app.post("/login", login); // Login users
app.post("/user/image", FBAuth, uploadImage); // Upload user profile picture
app.post("/user", FBAuth, addUserDetails); // Add user info (Bio, website, location)
app.get("/user/", FBAuth, getAuthenticatedUser); // Get authenticated user
app.get("/user/:userHandle", getUserDetails); // Get specific users details
app.post("/notifications", FBAuth, markNotificationsAsRead); // Read unread notifications

// Creates API function
// http://www.baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            postId: doc.id,
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      })
      .catch(err => {
        return console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        return console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-east2")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            postId: doc.id,
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      })
      .catch(err => {
        return console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("asia-east2")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    if (change.before.data().imageURL !== change.after.data().imageURL) {
      let batch = db.batch();
      return db
        .collection("/posts")
        .where("userHandle", "==", change.before.data().userHandle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageURL });
          });
          return batch.commit();
        });
    }
  });
