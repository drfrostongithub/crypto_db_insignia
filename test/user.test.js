const request = require("supertest");
const app = require("../server");
const { User, Wallet } = require("../models");
const { sequelize } = require("../models");
const jwt = require("../helper/jwt");

jest.mock("../models");
jest.mock("../helper/jwt");

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/register", () => {
    it("should register a user and create a wallet successfully", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
      };
      const mockWallet = { id: 1, userId: 1, amount: 0 };

      // Mock database methods
      User.create.mockResolvedValue(mockUser);
      Wallet.create.mockResolvedValue(mockWallet);
      const transaction = await sequelize.transaction();
      sequelize.transaction.mockResolvedValue(transaction);

      const response = await request(app)
        .post("/users/register")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("username", "testuser");
      expect(User.create).toHaveBeenCalledWith(
        { username: "testuser", password: expect.any(String) },
        { transaction }
      );
      expect(Wallet.create).toHaveBeenCalledWith(
        { userId: 1, amount: 0 },
        { transaction }
      );
    });

    it("should return an error if username or password is missing", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({ username: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Username and password are required"
      );
    });

    it("should rollback the transaction if an error occurs", async () => {
      const transaction = await sequelize.transaction();
      sequelize.transaction.mockResolvedValue(transaction);

      User.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/users/register")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.status).toBe(500);
      expect(transaction.rollback).toHaveBeenCalled();
    });
  });

  describe("POST /users/login", () => {
    it("should login successfully and return a token", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        validatePassword: jest.fn().mockResolvedValue(true),
      };
      const mockToken = "mock.jwt.token";

      User.findOne.mockResolvedValue(mockUser);
      jwt.generateToken.mockReturnValue(mockToken);

      const response = await request(app)
        .post("/users/login")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token", mockToken);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(mockUser.validatePassword).toHaveBeenCalledWith("testpassword");
    });

    it("should return an error if username or password is missing", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ username: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Username and password are required"
      );
    });

    it("should return an error for invalid username or password", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/users/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "error",
        "Unauthorized: Invalid username or password"
      );
    });
  });
});
