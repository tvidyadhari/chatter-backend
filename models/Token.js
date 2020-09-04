const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ttl
tokenSchema.index(
  { updatedAt: 1 },
  { expires: process.env.REFRESH_TOKEN_EXPIRY }
);

module.exports = new model("Token", tokenSchema);
