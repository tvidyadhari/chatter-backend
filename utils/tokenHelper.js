const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Token = require("../models/Token");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

exports.getAccessToken = async (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

exports.getRefreshToken = async (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

exports.verifyAccessToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(createError.Unauthorized("Token expired"));
      resolve(decoded);
    });
  });
};

exports.verifyRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return reject(createError.Unauthorized("Token expired"));

      const tokenExists = await Token.findOne({
        user_id: decoded.sub,
        token,
      });
      if (!tokenExists) reject(createError.Unauthorized("Invalid token"));
      resolve(decoded);
    });
  });
};

exports.getTokens = async (id) => {
  try {
    const accessToken = await this.getAccessToken(id);
    const refreshToken = await this.getRefreshToken(id);
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
