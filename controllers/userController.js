const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  async register(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw {
          name: "BadRequest",
          message: "Username and password are required",
        };
      }

      const user = await User.create({ username, password });
      res.status(201).json({
        message: "User registered successfully",
        username: user.username,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw {
          name: "BadRequest",
          message: "Username and password are required",
        };
      }

      const user = await User.findOne({ where: { username } });

      if (!user || !(await user.validatePassword(password))) {
        throw { name: "Unauthorized", message: "Invalid username or password" };
      }

      const token = generateToken({ id: user.id, username: user.username });
      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      next(err);
    }
  },
};
