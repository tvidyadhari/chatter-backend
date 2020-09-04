const Timeline = require("../../models/Timeline");
const Post = require("../../models/Post");

module.exports = async function (req, res, next) {
  // const { start, limit } = req.query;
  try {
    const { user } = req;
    const { _id: uid } = user;

    // get timeline
    const timeline = await Timeline.findOne({ user: uid });
    if (!timeline) return res.json({ data: { posts: [] } });
    const pids = Object.keys(timeline.posts);
    const posts = await Post.find({ _id: { $in: pids } })
      .populate("posted_by")
      .sort({ updatedAt: -1 });
    const postsMap = posts.reduce((acc, post) => {
      acc[post._id] = post;
      return acc;
    }, {});
    // send response
    res.json({
      data: {
        posts: postsMap,
      },
    });
  } catch (err) {
    next(err);
  }
};
