const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const { user } = req;

    // send user details
    const userInfo = await User.findById(user._id, {
      password: 0,
    }).populate("following", { password: 0 });

    const following = userInfo.following.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    return res.json({ data: { user: userInfo, following } });
  } catch (error) {
    next(error);
  }
};
