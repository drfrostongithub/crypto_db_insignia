const { Wallet, User, Transaction, sequelize } = require("../models");
const { Op, Sequelize } = require("sequelize");

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
      const { to_username, amount } = req.body;

      if (!to_username || !amount || amount <= 0) {
        throw { name: "BadRequest", message: "Invalid transfer details" };
      }

      const senderWallet = await Wallet.findOne({ where: { userId: +userId } });
      const recipientUser = await User.findOne({
        where: { username: to_username },
      });

      if (!senderWallet || !recipientUser) {
        throw { name: "NotFound", message: "Sender or recipient not found" };
      }

      // Ensure the recipient is not the sender
      const senderUser = await User.findByPk(+userId);
      if (recipientUser.username === senderUser.username) {
        throw {
          name: "BadRequest",
          message: "Cannot transfer to your own account",
        };
      }

      const recipientWallet = await Wallet.findOne({
        where: { userId: recipientUser.id },
      });

      if (!recipientWallet) {
        throw { name: "NotFound", message: "Recipient wallet not found" };
      }

      if (senderWallet.amount < amount) {
        throw { name: "BadRequest", message: "Insufficient balance" };
      }

      senderWallet.amount -= parseInt(amount);
      recipientWallet.amount += parseInt(amount);

      await senderWallet.save({ transaction: sequelizeTransaction });
      await recipientWallet.save({ transaction: sequelizeTransaction });

      // Create the transaction record within the same transaction
      await Transaction.create(
        {
          senderId: +userId,
          recipientId: recipientUser.id,
          amount,
          senderName: senderUser.username,
          recipientName: to_username,
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

  async listTopUsers(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;
      const topUsers = await Transaction.findAll({
        where: {
          senderId: userId, // Only consider outbound transfers
        },
        attributes: [
          "recipientId", // Group by recipient
          [sequelize.fn("SUM", sequelize.col("amount")), "totalTransferValue"], // Sum of transfer values
        ],
        group: ["recipientId"], // Group by recipientId to aggregate values
        order: [[sequelize.literal("totalTransferValue"), "DESC"]], // Order by totalTransferValue
        limit: 10, // Limit to top 10 users
        include: [
          {
            model: User,
            as: "Recipient",
            attributes: ["id", "username"], // Include recipient details
          },
        ],
      });
      console.log(topUsers);

      res.status(200).json({ topUsers });
    } catch (err) {
      next(err);
    }
  },

  async listTopTransactionsByUser(req, res, next) {
    try {
      const { id: userId } = req.decodedUser;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      // Fetch transactions with pagination and apply transformations
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
        order: [[Sequelize.literal('ABS("amount")'), "DESC"]], // Sort by absolute value of amount
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      // Transform transactions to set debit amounts as negative
      const transformedTransactions = transactions.map((transaction) => ({
        ...transaction.toJSON(),
        amount:
          transaction.senderId === userId
            ? -transaction.amount
            : transaction.amount,
      }));

      // Count total transactions for pagination
      const totalTransactions = await Transaction.count({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
        },
      });

      const totalPages = Math.ceil(totalTransactions / limit);

      res.status(200).json({
        transactions: transformedTransactions,
        totalPages,
        currentPage: parseInt(page),
        totalTransactions,
      });
    } catch (err) {
      next(err);
    }
  },
};
