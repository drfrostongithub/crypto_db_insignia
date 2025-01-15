const request = require("supertest");
const app = require("../server");
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

let token; // Declare a variable to store the token

// Middleware mock
const mockDecodedUser = { id: 1, username: "testuser" };

// Add a global middleware mock for decodedUser
app.use((req, res, next) => {
  req.decodedUser = mockDecodedUser;
  next();
});

beforeAll(() => {
  // Generate a token before all tests
  token = generateToken({ id: mockUser.id, username: mockUser.username });

  // Mock user validation for login
  User.findOne.mockImplementation(({ where: { username } }) => {
    if (username === "testuser") {
      return {
        ...mockUser,
        validatePassword: jest.fn().mockResolvedValue(true), // Correct password
      };
    }
    return null; // No user found
  });
});

describe("Wallet Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //   describe("createWallet", () => {
  //     it("should create a new wallet for the user", async () => {
  //       Wallet.findOne.mockResolvedValue(null); // No existing wallet
  //       Wallet.create.mockResolvedValue(mockWallet);

  //       const response = await request(app)
  //         .post("/wallets")
  //         .set("access_token", `${token}`)
  //         .send();

  //       //   console.log(response.body, response.status);

  //       expect(response.status).toBe(201);
  //       expect(response.body).toHaveProperty(
  //         "message",
  //         "Wallet created successfully"
  //       );
  //       expect(Wallet.create).toHaveBeenCalledWith({
  //         userId: mockDecodedUser.id,
  //         amount: 0,
  //       });
  //     });

  //     it("should return 400 if wallet already exists", async () => {
  //       Wallet.findOne.mockResolvedValue(mockWallet); // Wallet already exists

  //       const response = await request(app)
  //         .post("/wallets")
  //         .set("access_token", `${token}`)
  //         .send();

  //       expect(response.status).toBe(400);
  //       expect(response.body).toHaveProperty(
  //         "message",
  //         "Wallet already exists for this user"
  //       );
  //     });
  //   });

  describe("getBalance", () => {
    it("should return the wallet balance", async () => {
      Wallet.findOne.mockResolvedValue(mockWallet);
      const response = await request(app)
        .get("/wallets/balance")
        .set("access_token", `${token}`)
        .send();
      console.log(response.body, response.status, token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("balance", mockWallet.amount);
    });

    it("should return 404 if wallet not found", async () => {
      Wallet.findOne.mockResolvedValue(null);

      const response = await request(app).get("/wallets/balance").send();

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
