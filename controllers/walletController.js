const { Wallet, User, Transaction } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  async createWallet(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;

      const existingWallet = await Wallet.findOne({
        where: { UserId: userId },
      });
      if (existingWallet) {
        throw {
          name: "BadRequest",
          message: "Wallet already exists for this user",
        };
      }

      const wallet = await Wallet.create({ UserId: userId, amount: 0 });
      res.status(201).json({ message: "Wallet created successfully", wallet });
    } catch (err) {
      next(err);
    }
  },

  async getBalance(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;

      const wallet = await Wallet.findOne({ where: { UserId: userId } });
      if (!wallet) {
        throw { name: "NotFound", message: "Wallet not found" };
      }

      res.status(200).json({ balance: wallet.amount });
    } catch (err) {
      next(err);
    }
  },

  async deposit(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        throw { name: "BadRequest", message: "Invalid deposit amount" };
      }

      const wallet = await Wallet.findOne({ where: { UserId: userId } });
      if (!wallet) {
        throw { name: "NotFound", message: "Wallet not found" };
      }

      wallet.amount += amount;
      await wallet.save();

      res
        .status(200)
        .json({ message: "Deposit successful", balance: wallet.amount });
    } catch (err) {
      next(err);
    }
  },

  async transfer(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;
      const { recipientId, amount } = req.body;

      if (!recipientId || !amount || amount <= 0) {
        throw { name: "BadRequest", message: "Invalid transfer details" };
      }

      const senderWallet = await Wallet.findOne({ where: { UserId: userId } });
      const recipientWallet = await Wallet.findOne({
        where: { UserId: recipientId },
      });

      if (!senderWallet || !recipientWallet) {
        throw { name: "NotFound", message: "Wallet not found" };
      }

      if (senderWallet.amount < amount) {
        throw { name: "BadRequest", message: "Insufficient balance" };
      }

      senderWallet.amount -= amount;
      recipientWallet.amount += amount;

      await senderWallet.save();
      await recipientWallet.save();

      await Transaction.create({
        senderId: userId,
        recipientId,
        amount,
      });

      res.status(200).json({ message: "Transfer successful" });
    } catch (err) {
      next(err);
    }
  },

  async listTopTransactions(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;
      const { n } = req.params;

      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
        },
        order: [["amount", "DESC"]],
        limit: parseInt(n, 10),
      });

      res.status(200).json({ transactions });
    } catch (err) {
      next(err);
    }
  },

  async listTopUsers(req, res, next) {
    try {
      const users = await Transaction.findAll({
        attributes: [
          "senderId",
          [
            Transaction.sequelize.fn(
              "SUM",
              Transaction.sequelize.col("amount")
            ),
            "totalAmount",
          ],
        ],
        group: ["senderId"],
        order: [
          [
            Transaction.sequelize.fn(
              "SUM",
              Transaction.sequelize.col("amount")
            ),
            "DESC",
          ],
        ],
      });

      res.status(200).json({ users });
    } catch (err) {
      next(err);
    }
  },
};
