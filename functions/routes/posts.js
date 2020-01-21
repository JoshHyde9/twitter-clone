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
    userImage: req.user.imageURL,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  // Create post
  db.collection("posts")
    .add(newPost)
    .then(doc => {
      const resPost = newPost;
      resPost.postId = doc.id;
      return res.json(resPost);
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

exports.commentOnPost = (req, res) => {
  if (req.body.content.trim() === "") {
    return res.status(400).json({ error: "Must not be empty. " });
  }

  const newComment = {
    content: req.body.content,
    postId: req.params.postId,
    userHandle: req.user.userHandle,
    userImage: req.user.imageURL,
    createdAt: new Date().toISOString()
  };

  // Query DB
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      // Check if post exists
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found." });
      }
      // Increment comment count by 1
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      // Add comment to post
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.likePost = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.userHandle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDoc = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Post not found." });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            postId: req.params.postId,
            userHandle: req.user.userHandle
          })
          .then(() => {
            postData.likeCount++;
            return postDoc.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res.status(400).json({ error: "Post already liked." });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.unlikePost = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.userHandle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDoc = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Post not found." });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "Post not liked." });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--;
            return postDoc.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
