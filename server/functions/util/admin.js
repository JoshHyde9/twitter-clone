const admin = require("firebase-admin");

// https://firebase.google.com/docs/admin/setup
const serviceAccount = require("../serviceAccount.json");
// Init DB with auth stratergy
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
});

const db = admin.firestore();

module.exports = { admin, db };
