const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    posted_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 280 },
    image: { type: String, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reposts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = new model("Post", postSchema);
