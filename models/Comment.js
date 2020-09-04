const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commented_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 280 },
  },
  { timestamps: true }
);

module.exports = new model("Comment", commentSchema);
