const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const UserController = require("../controllers/userController");
const Controller = require(`../controllers/controller`);
const walletRoutes = require("./walletRoutes");

router.get(`/`, Controller.home);

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes
router.use(authentication);
router.use("/wallets", walletRoutes);

module.exports = router;
