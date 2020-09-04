const createError = require("http-errors");
const User = require("../models/User");

async function search(query) {
  try {
    const fullMatch = await User.find(
      { $text: { $search: query.replace("@", "") } },
      { password: 0 }
    );
    if (!fullMatch.length) {
      return await User.find(
        {
          $or: [
            { name: { $regex: `^${query}`, $options: "i" } },
            { username: { $regex: `^${query}`, $options: "i" } },
          ],
        },
        { password: 0 }
      ).limit(10);
    } else return fullMatch;
  } catch (err) {
    throw err;
  }
}

module.exports = async function (req, res, next) {
  try {
    // validate
    const { q } = req.query;
    if (!q || !q.trim().length)
      throw createError.UnprocessableEntity("q is missing");

    // send response
    return res.json({
      data: {
        users: await search(q.trim().replace("@", "")),
      },
    });
  } catch (err) {
    next(err);
  }
};
