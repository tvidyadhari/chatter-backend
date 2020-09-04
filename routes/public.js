const router = require("express").Router();
const controller = require("../controllers/auth");

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.delete("/logout", controller.logout);

router.post("/refresh", controller.refresh);

module.exports = router;
