const firebase = require("firebase");

const { admin, db } = require("../util/admin");
const firebaseConfig = require("../util/config");

// Init DB with config
firebase.initializeApp(firebaseConfig);

const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    userHandle: req.body.userHandle,
    userNickname: req.body.userNickname,
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
        userNickname: newUser.userNickname,
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
        return res.status(500).json({ general: "Something went wrong" });
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
      console.error(err);
      // Return with general error so other users don't know which credential is wrong (Bruteforce attack)
      return res.status(500).json({ general: "Invalid credentials" });
    });
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.userHandle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details updated successfully." });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get logged in user credentials
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.userHandle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.userHandle)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.userHandle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          postId: doc.data().postId,
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          type: doc.data().type,
          read: doc.data().read,
          createdAt: doc.data().createdAt,
          notificationId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
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

exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.userHandle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("posts")
          .where("userHandle", "==", req.params.userHandle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ error: "User not found." });
      }
    })
    .then(data => {
      userData.posts = [];
      data.forEach(doc => {
        userData.posts.push({
          content: doc.data().content,
          userHandle: doc.data().userHandle,
          userNickname: doc.data().userNickname,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          postId: doc.id,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.markNotificationsAsRead = (req, res) => {
  let batch = db.batch();

  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked as read" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
