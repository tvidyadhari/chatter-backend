const { loginSchema } = require("../../validators/auth");
const User = require("../../models/User");
const createError = require("http-errors");
const { getTokens } = require("../../utils/tokenHelper");
const Token = require("../../models/Token");
const { COOKIE_OPTIONS } = require("../../utils/constants");

module.exports = async function (req, res, next) {
  try {
    // validate
    const { email, password } = await loginSchema.validateAsync(req.body);

    // wrong email/ password
    const user = await User.findOne({ email }).populate("following", {
      password: 0,
    });
    if (!user || !(await user.isCorrectPassword(password)))
      throw createError.Unauthorized("Wrong email or password");

    const following = user.following.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    // generate tokens
    const { accessToken, refreshToken } = await getTokens(user._id);

    // send response
    const { password: _, ...rest } = user._doc;
    res.cookie("rt", refreshToken, COOKIE_OPTIONS).json({
      data: {
        at: accessToken,
        user: { ...rest },
        following,
      },
    });

    // whitelist rt
    await Token.findOneAndUpdate(
      { user_id: user._id },
      { token: refreshToken },
      { upsert: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    next(err);
  }
};
