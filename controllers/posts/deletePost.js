const Post = require("../../models/Post");
const createError = require("http-errors");
const Timeline = require("../../models/Timeline");
const User = require("../../models/User");

module.exports = async function (req, res, next) {
  try {
    // get user info
    const { user } = req;
    const { _id: uid } = user;

    // validate
    const { pid } = req.params;
    if (!pid) throw createError.UnprocessableEntity("Post id is missing");

    // 1. Delete the post from Post
    await Post.findByIdAndRemove(pid);

    // 2. Remove the pid from user’s posts
    await User.findByIdAndUpdate(uid, { $pull: { posts: pid } });

    // 3. Remove the pid from user’ + followers’ timelines -> remove [id] key.
    const followers = [uid].concat(user.followers);
    const timelines = await Timeline.find({ user: { $in: followers } });
    timelines.forEach(async (timeline) => {
      delete timeline.posts[pid];
      timeline.markModified(`posts`);
      await timeline.save();
    });

    // return success
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
