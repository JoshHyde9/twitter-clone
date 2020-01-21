const firebase = require("firebase");

const { db } = require("../util/admin");
const firebaseConfig = require("../util/config");

// Init DB with config
firebase.initializeApp(firebaseConfig);

const { validateSignUpData, validateLoginData } = require("../util/validators");

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    userHandle: req.body.userHandle,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

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
      token = idToken; // Set as generated JSON web token
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
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken(); // Generate JSON web token
    })
    .then(token => {
      return res.json({ token }); // return with JSON web token
    })
    .catch(err => {
      // Renamed returned error to give a general so other users don't know which credential is wrong (Bruteforce attack)
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({ general: "Invaild credentials." });
      }
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
