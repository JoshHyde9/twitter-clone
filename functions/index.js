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

// Get posts from Firebase DB
app.get("/posts", (req, res) => {
  admin
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
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
    body: req.body.body,
    userHandle: req.body.userHandle,
    createAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      return res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: `Something went wrong...` });
      console.error(err);
    });
});

// Creates API function
// http://www.baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
