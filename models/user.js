"use strict";
const { Model } = require("sequelize");
const bcryptjs = require(`bcryptjs`);
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Wallet, { foreignKey: "userId", as: "wallet" });
      User.hasMany(models.Transaction, {
        as: "SentTransactions",
        foreignKey: "senderId",
      });
      User.hasMany(models.Transaction, {
        as: "ReceivedTransactions",
        foreignKey: "recipientId",
      });
    }

    static async hashPassword(password) {
      return bcryptjs.hash(password, 10);
    }

    async validatePassword(password) {
      console.log("Validating password,", password);
      if (!password) {
        throw new Error("Password is required for validation");
      }
      return bcryptjs.compare(password, this.password);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8],
          is: /^(?=.*[a-zA-Z])(?=.*\d).+$/, // Must contain letters and numbers
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          user.password = await User.hashPassword(user.password);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await User.hashPassword(user.password);
          }
        },
      },
    }
  );
  return User;
};
