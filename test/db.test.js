const { Sequelize } = require("sequelize");
require("dotenv").config();

describe("Database Connection", () => {
  let sequelize;

  beforeAll(() => {
    sequelize = new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // Disable logging during tests
      }
    );
  });

  afterAll(async () => {
    await sequelize.close(); // Close the DB connection after tests
  });

  test("should connect to the database successfully", async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true); // Pass the test if no error occurs
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      expect(true).toBe(false); // Fail the test if there's an error
    }
  });
});
