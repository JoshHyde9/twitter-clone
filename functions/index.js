const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");

const express = require("express");
const app = express();

require("dotenv").config();

// Firebase config
// https://firebase.google.com/docs/admin/setup
const serviceAccount = require("./serviceAccount.json");

// https://firebase.google.com/docs/functions/config-env
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectIdL: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Init DB with auth stratergy
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
});

// Init DB with config
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

// Get posts from Firebase DB
app.get("/posts", (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          content: doc.data().content,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
});

// Post, post to Firebase DB
app.post("/post", (req, res) => {
  const newPost = {
    conent: req.body.content,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  // Create post
  db.collection("posts")
    .add(newPost)
    .then(doc => {
      return res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: `Something went wrong...` });
    });
});

// Signup route to create users accounts
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    userHandle: req.body.userHandle,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  let token, userId;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then(doc => {
      // If user handle already exists, send error
      if (doc.exists) {
        return res
          .status(400)
          .json({ userHandle: "User handle is already in use" });
      } else {
        // Create user in auth
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid; // Get user auth id
      return data.user.getIdToken(); // Generate JSON web token
    })
    .then(idToken => {
      token = idToken; // Set generated as JSON web token
      const userCreds = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };

      return db.doc(`/users/${newUser.userHandle}`).set(userCreds); // Create user in DB
    })
    .then(() => {
      return res.status(201).json({ token }); // Return with JSON web token
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// Creates API function
// http://www.baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
