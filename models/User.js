const { Schema, model } = require("mongoose");
const { PASSWORD_MIN_LENGTH } = require("../utils/constants");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: PASSWORD_MIN_LENGTH,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/chatter/image/upload/v1598886119/default-avatar.png",
    },
    bio: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    reposts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// index for search
userSchema.index(
  { username: "text", name: "text" },
  {
    weights: {
      username: 2,
    },
    name: "TextIndex",
  }
);

// check correct password
userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// hash password before saving
userSchema.pre("save", async function (err) {
  try {
    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
  } catch (err) {
    next(err);
  }
});

module.exports = new model("User", userSchema);
