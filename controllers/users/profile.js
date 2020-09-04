const Timeline = require("../../models/Timeline");
const Post = require("../../models/Post");
const User = require("../../models/User");
const createError = require("http-errors");

const transformToMap = (array) => {
  return array.reduce((acc, elem) => {
    acc[elem._id] = elem;
    return acc;
  }, {});
};

module.exports = async function (req, res, next) {
  try {
    const { username, action } = req.params;
    console.log(username, action);
    if (!username) throw createError.UnprocessableEntity("Username is missing");
    if (!action || !["posts", "likes", "reposts"].includes(action))
      throw createError.UnprocessableEntity("Action is missing/invalid");

    const user = await User.findOne({ username });
    if (!user) throw createError.NotFound("User not found");

    // get posts
    const posts = await Post.find({
      _id: { $in: user[action] },
    }).populate("posted_by");

    // send response
    res.json({
      data: {
        user,
        posts: transformToMap(posts),
      },
    });
  } catch (err) {
    next(err);
  }
};
