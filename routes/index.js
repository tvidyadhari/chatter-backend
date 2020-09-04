const router = require("express").Router();

// public
router.use("/auth", require("./public"));

// private - authorization required
router.use(require("../middleware/authorize"), require("./private"));

module.exports = router;
