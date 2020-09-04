const router = require("express").Router();

// all Post related
const posts = require("../controllers/posts");
router.get("/thread/:pid", posts.thread);
router.post("/post", posts.createPost);
router.delete("/post/:pid", posts.deletePost);
router.post("/like/:pid", posts.toggleLike);
router.post("/repost/:pid", posts.toggleRepost);
router.post("/comment", posts.comment);

// all user related
const users = require("../controllers/users");
router.post("/follow", users.toggleFollow);
router.get("/timeline", users.timeline);
router.get("/search", require("../controllers/search"));
router.use("/users/whoami", require("../controllers/whoami"));
router.get("/suggestions", users.suggestions);

router.get("/:username/:action", users.profile);

// image upload - bio
router.post("/upload", users.upload);

module.exports = router;
