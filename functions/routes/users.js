const firebase = require("firebase");

const { admin, db } = require("../util/admin");
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

  const noImg = "no-img.png";

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
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imageFileName;
  let imageToBeUploaded = {};

  const busBoy = new BusBoy({ headers: req.headers });

  // Setup uploaded image to be uploaded to FB Storage Bucket
  busBoy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted." });
    }

    const imageExtension = filename.split(".").pop();
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  // Store uploaded image into FB Storage Bucket
  busBoy.on("finish", () => {
    admin
      .storage()
      .bucket(`${firebaseConfig.storageBucket}`)
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.userHandle}`).update({ imageURL });
      })
      .then(() => {
        return res.json({ message: "Profile picture uploaded successfully." });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busBoy.end(req.rawBody);
};
