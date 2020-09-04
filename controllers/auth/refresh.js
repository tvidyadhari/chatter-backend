const User = require("../../models/User");
const createError = require("http-errors");
const Token = require("../../models/Token");
const { getTokens, verifyRefreshToken } = require("../../utils/tokenHelper");
const { COOKIE_OPTIONS } = require("../../utils/constants");

module.exports = async function (req, res, next) {
  try {
    // validate
    if (!req.cookies || !req.cookies.rt)
      throw createError.BadRequest("Token missing");

    // verify token
    const { sub: id } = await verifyRefreshToken(req.cookies.rt);

    if (id) {
      // generate tokens
      const { accessToken, refreshToken } = await getTokens(id);

      // send response
      res
        .cookie("rt", refreshToken, COOKIE_OPTIONS)
        .json({ data: { at: accessToken } });

      // whitelist rt
      await Token.findOneAndUpdate(
        { user_id: id },
        { token: refreshToken },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  } catch (err) {
    next(err);
  }
};
