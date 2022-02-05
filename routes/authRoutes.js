// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const authController = require("../controllers/authController");

// setup dedicated routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

// export router
module.exports = router;
