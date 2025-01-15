if (process.env.NODE_ENV !== "production") {
  require(`dotenv`).config();
  // config();
}
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const config = require("./config/config");
const Sequelize = require("sequelize");

const app = express();
const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV) {
//   sequelize = new Sequelize(config[process.env.NODE_ENV]);
// } else {
//   sequelize = new Sequelize(
//     config.process.env.DB_DATABASE,
//     config.process.env.DB_USERNAME,
//     config.process.env.DB_PASSWORD,
//     config
//   );
// }

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(routes);

// Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Crypto Wallet Backend is running!");
});

// Start the server only in production or non-test environments
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
