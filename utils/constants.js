const ms = require("ms");

module.exports = {
  PASSWORD_MIN_LENGTH: 8,
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: false,
    overwrite: true,
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
  },
};
