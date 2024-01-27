const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
    if (err) {
      res.status(401).json({ error: "You must be logged in." });
    }

    const { userId } = payload;
    const user = await User.findById(userId);
    req.user = user;

    next();
  });
};

module.exports = requireAuth;
