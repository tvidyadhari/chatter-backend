const Joi = require("joi");
const createError = require("http-errors");

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.signupSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

exports.accessTokenSchema = function (authorization) {
  if (!authorization) throw createError.Unauthorized("Invalid token");
  const accessToken = authorization.split(" ")[1];
  if (!accessToken) throw createError.Unauthorized("Invalid token");
  return true;
};

// exports.logoutSchema = Joi.object({
//   id: Joi.string().length(24).required(),
// });
