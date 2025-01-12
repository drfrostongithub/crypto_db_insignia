const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authentication = require("../middlewares/authentication");

// Apply authentication to wallet routes
router.use(authentication);
// Wallet operations
// router.post("/create", walletController.createWallet);
router.get("/balance", walletController.getBalance);
router.post("/deposit", walletController.deposit);
router.post("/transfer", walletController.transfer);
router.get("/transactions/top/:n", walletController.listTopTransactions);
router.get("/transactions/users/top", walletController.listTopUsers);

module.exports = router;
