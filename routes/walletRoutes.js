const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/walletController");

// Apply authentication to wallet routes

// Wallet operations
// router.post("/create", walletController.createWallet);
router.get("/balance", WalletController.getBalance);
router.post("/deposit", WalletController.deposit);
router.post("/transfer", WalletController.transfer);
router.get(
  "/transactions/user/top",
  WalletController.listTopTransactionsByUser
);
router.get("/transactions/top", WalletController.listTopSpenders);

module.exports = router;
