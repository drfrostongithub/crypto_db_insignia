const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

// Apply authentication to wallet routes

// Wallet operations
// router.post("/create", walletController.createWallet);
router.get("/balance", walletController.getBalance);
router.post("/deposit", walletController.deposit);
router.post("/transfer", walletController.transfer);
router.get(
  "/transactions/user/top",
  walletController.listTopTransactionsByUser
);
router.get("/transactions/top", walletController.listTopSpenders);

module.exports = router;
