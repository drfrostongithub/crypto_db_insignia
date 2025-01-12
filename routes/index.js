const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");
const Controller = require(`../controllers/controller`);
const walletRoutes = require("./walletRoutes");

router.get(`/`, Controller.home);

// Public routes
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);

// Protected routes
router.use(authentication);
router.use("/wallets", walletRoutes);

module.exports = router;
