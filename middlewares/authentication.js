const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const accessToken = req.headers["access_token"];
    if (!accessToken) {
      throw { name: "Unauthorized", message: "Access token is missing" };
    }

    // Verify token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Find user by username (or adjust to another unique identifier)
    const user = await User.findOne({ where: { username: decoded.username } });
    if (!user) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    // Attach user info to the request object for downstream use
    req.decodedUser = { id: user.id, username: user.username };
    next();
  } catch (err) {
    next({
      name: "Unauthorized",
      message: err.message || "Authentication failed",
    });
  }
}

module.exports = authentication;
