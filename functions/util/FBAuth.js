const { admin, db } = require("./admin");

// Check if user is authenticated
module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1]; // Get token by splitting "Authorization" header value
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorised" });
  }

  // Check if user token is supplied by DB
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.userHandle = data.docs[0].data().userHandle;
      return next();
    })
    .catch(err => {
      console.error("Error whilst verifying token", err);
      return res.status(403).json(err);
    });
};
