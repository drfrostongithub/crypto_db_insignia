const request = require("supertest");
const app = require("../index");
const { Wallet, User, Transaction, sequelize } = require("../models");
const { generateToken } = require("../helper/jwt"); // Ensure this path is correct

jest.mock("../models", () => ({
  Wallet: { findOne: jest.fn(), create: jest.fn() },
  User: { findOne: jest.fn(), findByPk: jest.fn() },
  Transaction: { findAll: jest.fn(), create: jest.fn(), count: jest.fn() },
  sequelize: {
    transaction: jest.fn(() => ({ commit: jest.fn(), rollback: jest.fn() })),
  },
}));

const mockTransaction = sequelize.transaction();

// Mock data
const mockUser = { id: 1, username: "testuser" };
const mockWallet = { id: 1, userId: 1, amount: 100, save: jest.fn() };
const mockRecipientWallet = { id: 2, userId: 2, amount: 200, save: jest.fn() };
const mockRecipientUser = { id: 2, username: "recipientuser" };
const mockTransactionRecord = {
  id: 1,
  senderId: 1,
  recipientId: 2,
  amount: 50,
};

// Middleware mock
// const mockDecodedUser = { id: 1, username: "testuser" };

// // Add a global middleware mock for decodedUser
// app.use((req, res, next) => {
//   req.decodedUser = mockDecodedUser;
//   next();
// });

describe("Wallet Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a token before all tests
    token = generateToken({ id: mockUser.id, username: mockUser.username });

    // // Mock user validation for login
    // User.findOne.mockImplementation(({ where: { username } }) => {
    //   if (username === "testuser") {
    //     return {
    //       ...mockUser,
    //       validatePassword: jest.fn().mockResolvedValue(true), // Correct password
    //     };
    //   }
    //   return null; // No user found
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /wallets/transfer", () => {
    it("should transfer funds from one wallet to another", async () => {
      Wallet.findOne.mockResolvedValueOnce(mockWallet);
      Wallet.findOne.mockResolvedValueOnce(mockRecipientWallet);
      Transaction.create.mockResolvedValueOnce(mockTransactionRecord);
      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/wallets/transfer")
        .set("access_token", `${token}`)
        .send({
          recipientId: mockRecipientUser.id,
          amount: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Transfer successful");
      expect(Wallet.findOne).toHaveBeenCalledTimes(2);
      expect(Transaction.create).toHaveBeenCalledTimes(1);
      expect(mockWallet.save).toHaveBeenCalledTimes(1);
      expect(mockRecipientWallet.save).toHaveBeenCalledTimes(1);
    });

    it("should return an error if the sender does not have enough funds", async () => {
      Wallet.findOne.mockResolvedValueOnce({ ...mockWallet, amount: 10 });
      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/wallets/transfer")
        .set("access_token", `${token}`)
        .send({
          recipientId: mockRecipientUser.id,
          amount: 50,
        });
      console.log(response.body, response.status);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid transfer details");
      expect(Wallet.findOne).toHaveBeenCalledTimes(1);
      expect(Transaction.create).not.toHaveBeenCalled();
    });
  });

  describe("getBalance", () => {
    it("should return the wallet balance", async () => {
      Wallet.findOne.mockResolvedValue(mockWallet);
      User.findByPk.mockResolvedValue(mockUser);
      const response = await request(app)
        .get("/wallets/balance")
        .set("access_token", `${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("balance", mockWallet.amount);
    });

    it("should return 404 if wallet not found", async () => {
      Wallet.findOne.mockResolvedValue(null);

      const response = await request(app)
        .set("access_token", `${token}`)
        .get("/wallets/balance")
        .send();

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Wallet not found");
    });
  });

  describe("deposit", () => {
    it("should deposit an amount to the wallet", async () => {
      Wallet.findOne.mockResolvedValue(mockWallet);

      const response = await request(app)
        .post("/wallets/deposit")
        .send({ amount: 50 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Deposit successful");
      expect(Wallet.findOne).toHaveBeenCalledWith({
        where: { userId: mockDecodedUser.id },
      });
      expect(mockWallet.save).toHaveBeenCalled();
    });

    it("should return 400 for invalid deposit amount", async () => {
      const response = await request(app)
        .post("/wallets/deposit")
        .send({ amount: -50 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid deposit amount");
    });
  });

  describe("transfer", () => {
    it("should transfer amount between wallets", async () => {
      Wallet.findOne
        .mockResolvedValueOnce(mockWallet) // Sender wallet
        .mockResolvedValueOnce(mockRecipientWallet); // Recipient wallet

      User.findOne.mockResolvedValue(mockRecipientUser);
      User.findByPk.mockResolvedValue(mockUser);

      Transaction.create.mockResolvedValue(mockTransactionRecord);

      const response = await request(app)
        .post("/wallets/transfer")
        .send({ to_username: "recipientuser", amount: 50 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Transfer successful");
      expect(mockWallet.save).toHaveBeenCalled();
      expect(mockRecipientWallet.save).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it("should return 400 if transfer amount is invalid", async () => {
      const response = await request(app)
        .post("/wallets/transfer")
        .send({ to_username: "recipientuser", amount: -50 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid transfer details"
      );
    });

    it("should return 400 if insufficient balance", async () => {
      Wallet.findOne.mockResolvedValue(mockWallet); // Sender wallet with insufficient balance
      User.findOne.mockResolvedValue(mockRecipientUser);
      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/wallets/transfer")
        .send({ to_username: "recipientuser", amount: 500 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Insufficient balance");
    });
  });
});
