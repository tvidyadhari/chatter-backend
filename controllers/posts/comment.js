const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const createError = require("http-errors");

module.exports = async function (req, res, next) {
  try {
    const { user } = req;
    const { _id: uid } = user;

    const { pid, comment: text } = req.body;
    const post = await Post.findById(pid);

    if (!post) throw createError.NotFound("Post not found");

    const newComment = await Comment.create({
      post_id: pid,
      text,
      commented_by: uid,
    });

    post.comments.push(newComment._id);
    await post.save();

    res.json({
      data: {
        comment: newComment,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
