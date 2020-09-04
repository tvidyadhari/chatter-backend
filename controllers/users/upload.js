const User = require("../../models/User");

module.exports = async function (req, res, next) {
  try {
    const { user } = req;
    const { url } = req.body;
    if (!url) throw createError.UnprocessableEntity("URL is missing");
    // update avatar
    user.avatar = url;
    await user.save();
    // send response
    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};
