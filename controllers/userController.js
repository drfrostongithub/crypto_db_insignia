const { User, Wallet, sequelize } = require("../models");
const { generateToken } = require("../helper/jwt");

class UserController {
  static async login(req, res, next) {
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
  }

  static async register(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw {
          name: "BadRequest",
          message: "Username and password are required",
        };
      }

      // Create User
      const user = await User.create({ username, password }, { transaction });
      // console.log("User created:", user.id);

      // Create wallet for the user
      await Wallet.create({ userId: user.id, amount: 0 }, { transaction });
      console.log("Wallet created for User ID:", user.id);

      // Commit the transaction
      await transaction.commit();

      res.status(201).json({
        message: "User registered successfully",
        username: user.username,
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }
}

module.exports = UserController;
