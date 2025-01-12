"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Wallet.hasMany(models.Transaction, {
        as: "SentTransactions",
        foreignKey: "senderUserId",
      });
      Wallet.hasMany(models.Transaction, {
        as: "ReceivedTransactions",
        foreignKey: "recipientUserId",
      });
    }
  }
  Wallet.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Wallet",
    }
  );
  return Wallet;
};
