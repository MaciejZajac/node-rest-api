const express = require("express");
const { body } = require("express-validator/check");
const feedController = require("../controllers/feed");
const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post(
    "/post",
    [
        body("title")
            .trim()
            .isLength({ min: 5, max: 30 }),
        body("content")
            .trim()
            .isLength({ min: 5, max: 200 })
    ],
    feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

router.put(
    "/post/:postId",
    [
        body("title")
            .trim()
            .isLength({ min: 5, max: 30 }),
        body("content")
            .trim()
            .isLength({ min: 5, max: 200 })
    ],
    feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
