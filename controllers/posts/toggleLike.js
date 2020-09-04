const createError = require("http-errors");
const Timeline = require("../../models/Timeline");
const Post = require("../../models/Post");

module.exports = async function (req, res, next) {
  try {
    // get user info
    const { user } = req;
    const { _id: uid } = user;

    // validate
    const { pid } = req.params;
    if (!pid) throw createError.UnprocessableEntity("Post id missing");
    const post = await Post.findById(pid);

    // 0. decide to add or remove like
    let like = false;
    const newPostLikes = post.likes.filter(
      (id) => id.toString() !== uid.toString()
    );
    const newLikes = user.likes.filter(
      (id) => id.toString() !== pid.toString()
    );
    if (newLikes.length === user.likes.length) {
      like = true;
      newPostLikes.push(user._id);
      newLikes.push(pid);
    }

    // 1. Add/Remove uid to/from post’s likes
    post.likes = newPostLikes;
    await post.save();

    // 2. Add/Remove pid to/from user’s likes
    user.likes = newLikes;
    await user.save();

    const followers = [...user.followers];
    const timelines = await Timeline.find({ user: { $in: followers } });

    timelines.forEach(async (timeline) => {
      // 3.1. Add/Increment count of pid in the followers’ timelines -> {[pid] += 1}
      if (like) timeline.posts[pid] = (timeline.posts[pid] || 0) + 1;
      else {
        // 3.2. Decrement count; if count becomes 0 remove.
        timeline.posts[pid] -= 1;
        if (timeline.posts[pid] <= 0) delete timeline.posts[pid];
      }
      timeline.markModified(`posts`);
      await timeline.save();
    });

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};
