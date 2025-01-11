// if (
//   process.env.NODE_ENV == "development" ||
//   process.env.NODE_ENV == "production"
// ) {
//   require(`dotenv`).config();
// }

require(`dotenv`).config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
