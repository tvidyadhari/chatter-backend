const Post = require("../../models/Post");
const createError = require("http-errors");
const Timeline = require("../../models/Timeline");

module.exports = async function (req, res, next) {
  try {
    // get user info
    const { user } = req;
    const { _id: uid } = user;

    // validate
    const { text, image } = req.body;
    console.log(text, image);
    if (!text.trim() && !image)
      throw createError.UnprocessableEntity("Text/Image is empty/missing");

    // 1. Create a post
    const newPost = await Post.create({ posted_by: uid, text, image });

    const { _id: pid } = newPost;
    // 4. return response
    res.json({ data: { [pid]: newPost } });

    // 2. Add the pid to user’s posts
    user.posts.push(pid);
    await user.save();

    // 3. Add the pid to user’ + followers’ timelines -> {[pid]: 1}
    const followers = [uid].concat(user.followers);
    await Timeline.updateMany(
      { user: { $in: followers } },
      { $set: { [`posts.${pid}`]: 1 } },
      { upsert: true } // upsert to create timeline if it doesn't exist
    );
  } catch (err) {
    next(err);
  }
};
