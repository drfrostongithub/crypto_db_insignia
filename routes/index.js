const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const walletController = require("../controllers/walletController");
const userController = require("../controllers/userController");

const Controller = require(`../controllers/controller`);

router.get(`/`, Controller.home);

// Public routes
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);

// Protected routes
router.use(authentication);
// router.get("/wallet", walletController.getWallet);
// router.post("/wallet/deposit", walletController.deposit);
// router.post("/wallet/transfer", walletController.transfer);

module.exports = router;
