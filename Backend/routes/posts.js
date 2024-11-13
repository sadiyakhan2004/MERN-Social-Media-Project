const router = require("express").Router({ mergeParams: true });
const Post = require("../models/post.js");
const User = require("../models/user.js");

// Create a Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  console.log(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  }
  catch (err) {
    res.status(500).send(err);
  }
})
// Update a Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await Post.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).send("Post has been updated");
    } else {
      res.status(403).send("You can update only your account");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
})

// Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).send("Post has been deleted");
    } else {
      res.status(403).send("You can delete only your account");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
})

// Like a Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await Post.findByIdAndUpdate(req.params.id, { $push: { likes: req.body.userId } });
      res.status(200).send("post has been liked");
    }
    else {
      await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: req.body.userId } });
      res.status(200).send("post has been unliked");
    }
  } catch (err) {
    res.status(500).send(err);
  }
})


// Get timeline Posts
router.get("/timeline", async (req, res) => {
  try {
    const currUser = await User.findById(req.body.userId);
    const currUserPosts = await Post.find({ userId: currUser._id });
    const friendPost = await Promise.all(
      currUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.send(currUserPosts.concat(...friendPost));
  }
  catch (err) {
    res.status(500).send(err);
  }

});

// Get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  }
  catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;