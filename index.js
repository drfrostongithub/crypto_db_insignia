// if (process.env.NODE_ENV !== "production") {
//   require(`dotenv`).config();
//   // config();
// }

require(`dotenv`).config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const config = require("./config/config");
const Sequelize = require("sequelize");
const pg = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// console.log(config[process.env.NODE_ENV]);
if (process.env.NODE_ENV && config[process.env.NODE_ENV]) {
  sequelize = new Sequelize(config[process.env.NODE_ENV]);
} else {
  const dbName = process.env.DB_DATABASE;
  const dbUser = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbConfig = { dialect: "postgres", dialectModule: pg };

  if (!dbName || !dbUser || !dbPassword) {
    throw new Error(
      "Database configuration is missing in environment variables"
    );
  }

  sequelize = new Sequelize(dbName, dbUser, dbPassword, dbConfig);
}

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(routes);

// Error Handler
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("Crypto Wallet Backend is running!");
// });

// Start the server only in production or non-test environments
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
