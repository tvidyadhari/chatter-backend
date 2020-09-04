const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const createError = require("http-errors");

module.exports = async function (req, res, next) {
  try {
    const { user } = req;
    const { _id: uid } = user;

    const { pid } = req.params;
    const post = await Post.findById(pid).populate("posted_by", {
      password: 0,
    });

    if (!post) throw createError.NotFound("Post not found");

    const comments = await Comment.find({ post_id: pid })
      .populate("commented_by", {
        password: 0,
      })
      .sort({ createdAt: -1 });
    const commentsMap = comments.reduce((acc, comment) => {
      acc[comment._id] = comment;
      return acc;
    }, {});
    // send response
    res.json({
      data: {
        post,
        comments: commentsMap,
      },
    });
  } catch (err) {
    next(err);
  }
};
