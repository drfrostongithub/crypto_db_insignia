"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        as: "Sender",
        foreignKey: "senderId",
      });
      Transaction.belongsTo(models.User, {
        as: "Recipient",
        foreignKey: "recipientId",
      });
      Transaction.belongsTo(models.Wallet, {
        as: "SenderWallet",
        foreignKey: "senderId",
      });
      Transaction.belongsTo(models.Wallet, {
        as: "RecipientWallet",
        foreignKey: "recipientId",
      });
    }
  }
  Transaction.init(
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Sender ID is required" },
          isInt: { msg: "Sender ID must be an integer" },
        },
      },
      recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Recipient ID is required" },
          isInt: { msg: "Recipient ID must be an integer" },
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Transaction amount is required" },
          isFloat: { msg: "Amount must be a valid number" },
          min: {
            args: [0.01],
            msg: "Transaction amount must be greater than zero",
          },
        },
      },
      senderName: {
        type: DataTypes.STRING, // Add this field
        allowNull: false,
      },
      recipientName: {
        type: DataTypes.STRING, // Add this field
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
