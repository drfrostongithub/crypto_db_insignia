const { Wallet, User, Transaction, sequelize } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  async createWallet(req, res, next) {
    try {
      console.log(req, "jalan");
      const { id: userId } = req.decodedUser;

      const existingWallet = await Wallet.findOne({
        where: { userId: userId },
      });
      if (existingWallet) {
        throw {
          name: "BadRequest",
          message: "Wallet already exists for this user",
        };
      }

      const wallet = await Wallet.create({ userId: userId, amount: 0 });
      res.status(201).json({ message: "Wallet created successfully", wallet });
    } catch (err) {
      next(err);
    }
  },

  async getBalance(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;

      const wallet = await Wallet.findOne({ where: { userId: userId } });
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

      const wallet = await Wallet.findOne({ where: { userId: userId } });
      if (!wallet) {
        throw { name: "NotFound", message: "Wallet not found" };
      }

      wallet.amount += parseInt(amount);
      await wallet.save();

      res
        .status(200)
        .json({ message: "Deposit successful", balance: wallet.amount });
    } catch (err) {
      next(err);
    }
  },

  async transfer(req, res, next) {
    const sequelizeTransaction = await sequelize.transaction();
    try {
      const { id: userId } = req.decodedUser;
      const { recipientId, amount } = req.body;

      if (!recipientId || !amount || amount <= 0) {
        throw { name: "BadRequest", message: "Invalid transfer details" };
      }

      // Ensure the recipient is not the sender
      if (recipientId === userId) {
        throw {
          name: "BadRequest",
          message: "Cannot transfer to your own account",
        };
      }

      const senderWallet = await Wallet.findOne({ where: { userId: +userId } });
      const recipientWallet = await Wallet.findOne({
        where: { userId: +recipientId },
      });
      // console.log(senderWallet, recipientWallet);
      if (!senderWallet || !recipientWallet) {
        throw { name: "NotFound", message: "Wallet not found" };
      }

      if (senderWallet.amount < amount) {
        throw { name: "BadRequest", message: "Insufficient balance" };
      }

      senderWallet.amount -= parseInt(amount);
      recipientWallet.amount += parseInt(amount);

      await senderWallet.save({ transaction: sequelizeTransaction });
      await recipientWallet.save({ transaction: sequelizeTransaction });

      // Create the transaction record within the same transaction
      const senderUser = await User.findByPk(+userId, {
        transaction: sequelizeTransaction,
      });
      const recipientUser = await User.findByPk(+recipientId, {
        transaction: sequelizeTransaction,
      });
      await Transaction.create(
        {
          senderId: +userId,
          recipientId: +recipientId,
          amount,
          senderName: senderUser.username,
          recipientName: recipientUser.username,
        },
        { transaction: sequelizeTransaction }
      );

      // Commit the transaction
      await sequelizeTransaction.commit();

      res.status(200).json({ message: "Transfer successful" });
    } catch (err) {
      await sequelizeTransaction.rollback();
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
      const { id: userId } = req.decodedUser;

      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
        },
        attributes: ["id", "senderId", "recipientId", "amount", "createdAt"],
        include: [
          {
            model: User,
            as: "Sender",
            attributes: ["id", "username"],
          },
          {
            model: User,
            as: "Recipient",
            attributes: ["id", "username"],
          },
        ],
        order: [["amount", "DESC"]], // Order by amount in descending order
      });

      res.status(200).json({ transactions });
    } catch (err) {
      next(err);
    }
  },
};
