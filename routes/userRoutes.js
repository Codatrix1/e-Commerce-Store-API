// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const userController = require("../controllers/userController");

// import middleware
const { authenticateUser } = require("../middleware/authentication");

//-------------
// Routes Setup
//-------------

// @desc: Protected and Admin Only
router.route("/").get(authenticateUser, userController.getAllUsers);

// @desc: Protected
// NOTE: Placement is EXTREMLY IMPORTANT while setting up the "/showMe","/updateUser" and "/updateUserPassword" route:
// else it wont work as express will confuse this with the id param which is not what I want
router.route("/showMe").get(userController.showCurrentUser);
router.route("/updateUser").patch(userController.updateUser);
router.route("/updateUserPassword").patch(userController.updateUserPassword);

// Order of Placement of this function is very important
router.route("/:id").get(authenticateUser, userController.getSingleUser);

module.exports = router;
