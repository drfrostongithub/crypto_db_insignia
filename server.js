// if (
//   process.env.NODE_ENV == "development" ||
//   process.env.NODE_ENV == "production"
// ) {
//   require(`dotenv`).config();
// }

require(`dotenv`).config();

const express = require(`express`);

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

//use cors here
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Crypto Wallet Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
