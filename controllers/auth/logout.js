const User = require("../../models/User");
const createError = require("http-errors");
const { verifyRefreshToken } = require("../../utils/tokenHelper");
const Token = require("../../models/Token");
const { COOKIE_OPTIONS } = require("../../utils/constants");

module.exports = async function (req, res, next) {
  try {
    // validate
    if (!req.cookies || !req.cookies.rt)
      throw createError.BadRequest("Token missing");

    // verify token
    const { sub: id } = await verifyRefreshToken(req.cookies.rt);

    if (id) {
      // delete rt
      res.clearCookie("tk", COOKIE_OPTIONS);
      await Token.findOneAndDelete({ user_id: id });
    }
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};
