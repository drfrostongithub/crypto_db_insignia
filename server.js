if (
  process.env.NODE_ENV == "development" ||
  process.env.NODE_ENV == "production"
) {
  require(`dotenv`).config();
}

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Crypto Wallet Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
