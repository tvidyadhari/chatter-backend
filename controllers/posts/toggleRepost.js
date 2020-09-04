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

    // decide to repost or un-repost
    let repost = false;
    const newPostReposts = post.reposts.filter(
      (id) => id.toString() !== uid.toString()
    );
    const newReposts = user.reposts.filter(
      (id) => id.toString() !== pid.toString()
    );

    // add repost
    if (newReposts.length === user.reposts.length) {
      repost = true;
      newPostReposts.push(user._id);
      newReposts.push(pid);
    }

    // save
    post.reposts = newPostReposts;
    await post.save();
    user.reposts = newReposts;
    await user.save();

    const followers = [...user.followers];
    const timelines = await Timeline.find({ user: { $in: followers } });
    timelines.forEach(async (timeline) => {
      if (repost) timeline.posts[pid] = (timeline.posts[pid] || 0) + 1;
      else {
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
