const User = require("../../models/User");

module.exports = async function (req, res, next) {
  try {
    const { user } = req;
    const users = await User.find(
      { _id: { $ne: user._id }, followers: { $ne: user._id } },
      { password: 0 }
    ).limit(3);

    // send response
    res.json({
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
