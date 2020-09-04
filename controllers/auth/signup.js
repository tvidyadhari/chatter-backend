const { signupSchema } = require("../../validators/auth");
const User = require("../../models/User");
const createError = require("http-errors");
const Timeline = require("../../models/Timeline");

module.exports = async function (req, res, next) {
  try {
    // validate
    const {
      fullname: name,
      email,
      password,
      username,
    } = await signupSchema.validateAsync(req.body);

    // check if username already exists
    if (await User.findOne({ username }))
      throw createError.Conflict("Username already exists");
    // check if email already exists
    if (await User.findOne({ email }))
      throw createError.Conflict("Email already exists");

    // create a new user
    const newUser = await User.create({
      name,
      username,
      email,
      password,
    });

    // create timeline for user
    await Timeline.create({ user: newUser._id });

    // send response
    return res.json({ data: "Signed up successfully" });
  } catch (err) {
    next(err);
  }
};
