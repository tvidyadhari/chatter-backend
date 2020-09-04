const createError = require("http-errors");
const User = require("../../models/User");
const Timeline = require("../../models/Timeline");

// follow X
module.exports = async function (req, res, next) {
  try {
    // get user info
    const { user } = req;
    const { _id: uid } = user;

    // validate
    const { xid } = req.body;
    if (!xid) throw createError.UnprocessableEntity("X id missing");
    const X = await User.findById(xid);

    // decide to follow or un-follow
    let follow = false;

    // un-follow: update following + followers
    const newFollowing = user.following.filter(
      (id) => id.toString() != xid.toString()
    );
    const newFollowers = X.followers.filter(
      (id) => id.toString() != uid.toString()
    );

    // follow: update following + followers
    if (newFollowing.length === user.following.length) {
      follow = true;
      newFollowing.push(xid);
      newFollowers.push(uid);
    }

    // save follower
    X.followers = newFollowers;
    await X.save();
    // save following
    user.following = newFollowing;
    await user.save();

    // return response
    res.status(200).end();

    // add/remove feed from timeline
    const feed = X.likes.concat(X.reposts, X.posts);
    const timeline = await Timeline.findOne({ user: uid });

    feed.forEach((pid) => {
      if (follow) timeline.posts[pid] = (timeline.posts[pid] || 0) + 1;
      else {
        timeline.posts[pid] -= 1;
        if (timeline.posts[pid] <= 0) delete timeline.posts[pid];
      }
    });

    timeline.markModified(`posts`);
    await timeline.save();
  } catch (err) {
    next(err);
  }
};

// ref: https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
