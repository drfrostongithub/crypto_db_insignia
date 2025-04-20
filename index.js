// if (process.env.NODE_ENV !== "production") {
//   require(`dotenv`).config();
//   // config();
// }

require(`dotenv`).config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const { sequelize } = require("./models");

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(routes);

// Error Handler
app.use(errorHandler);

// Start the server only in production or non-test environments
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
