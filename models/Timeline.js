const { Schema, model } = require("mongoose");
const timelineSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    posts: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
  { minimize: false }
);

module.exports = new model("Timeline", timelineSchema);
