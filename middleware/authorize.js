const { verifyAccessToken } = require("../utils/tokenHelper");
const createError = require("http-errors");
const User = require("../models/User");

const authorize = async (req, res, next) => {
  try {
    // verifying token
    const token = req.headers.authorization.split(" ")[1];

    // get user id
    const { sub: id } = await verifyAccessToken(token);
    const user = await User.findById(id, { password: 0 });
    if (!user) throw Error("User not found");

    // pass on user
    req.user = user;

    // proceed to the next middleware
    next();
  } catch (err) {
    next(createError.Unauthorized("Invalid token"));
  }
};

module.exports = authorize;
