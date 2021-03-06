const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const Post = require("../../../models/Post");
const User = require("../../../models/User");
const ModeratorRequest = require("../../../models/ModeratorRequest");

//middleware
const auth = require("../../../middleware/auth");
const RecordLog = require("../../../utils/recordLog");
const requiredRole = require("../../../middleware/requiredRole");

const writeLog = async (id, success) => {
  await RecordLog(id, "write", {
    type: "post",
    success: success,
  });
};

const readLog = async (id, success) => {
  await RecordLog(id, "read", {
    type: "post",
    success: success,
  });
};

const deleteLog = async (id, success) => {
  await RecordLog(id, "delete", {
    type: "post",
    success: success,
  });
};

// @route    POST api/posts/v1
// @desc     Create a post
// @access   Private
router.post(
  "/",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      writeLog(req.user.id, false);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user ? user.name : "",
        avatar: user ? user.avatar : "",
        user: req.user.id,
      });

      const post = await newPost.save();
      res.status(201).json(post);
      writeLog(req.user.id, true);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.toString());
      writeLog(req.user.id, false);
    }
  }
);

// @route    GET api/posts/v1
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().limit(20).sort({ date: -1 });
    res.json(posts);
    readLog(req.user.id, true);
  } catch (err) {
    res.status(500).send("Server Error");
    readLog(req.user.id, false);
  }
});

// @route    GET api/posts/v1/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      readLog(req.user.id, false);
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
    readLog(req.user.id, true);
  } catch (err) {
    res.status(500).send("Server Error");
    readLog(req.user.id, false);
  }
});

// @route    DELETE api/posts/v1/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      deleteLog(req.user.id, false);
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      deleteLog(req.user.id, false);
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
    deleteLog(req.user.id, true);
  } catch (err) {
    res.status(500).send("Server Error");
    deleteLog(req.user.id, false);
  }
});

// admin routes

// @route    POST api/posts/v1
// @desc     Create a post
// @access   Private
router.put(
  "/:id/",
  [auth, requiredRole("admin")],
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      writeLog(req.user.id, false);
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (user.role === "super_admin") {
        // perform post update directly
        const postData = await Post.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { text: text } }
        );
        return res.status(201).json(postData);
      } else {
        console.log("creating update request");
        const newChangeRequest = new ModeratorRequest({
          post: req.params.id,
          request_type: "update",
          updated_data: { text: text },
          moderator: req.user.id,
        });

        const changeReq = await newChangeRequest.save();
        res.status(201).json(changeReq);
        writeLog(req.user.id, true);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err.toString());
      writeLog(req.user.id, false);
    }
  }
);

module.exports = router;
