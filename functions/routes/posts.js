const { db } = require("../util/admin");

exports.getAllPosts = (req, res) => {
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
};

exports.createPost = (req, res) => {
  if (req.body.content.trim() === "") {
    return res.status(400).json({ content: "Content must not be empty" });
  }

  const newPost = {
    content: req.body.content,
    userHandle: req.user.userHandle,
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
};

exports.getPost = (req, res) => {
  let postData = {};

  // Query DB for post with requested id
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found." });
      }

      // TODO: Get likes that contains requested post id

      // Get comments that contains requested post id
      postData = doc.data();
      postData.postId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then(data => {
      // Add each comment to array
      postData.comments = [];
      data.forEach(doc => {
        postData.comments.push(doc.data());
      });
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
