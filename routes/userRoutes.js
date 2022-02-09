// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const userController = require("../controllers/userController");

// setup routes
router.route("/").get(userController.getAllUsers);

// IMP NOTE: Order is important while setting up the "/showMe","/updateUser" and "/updateUserPassword" route:
// else it wont work as express will confuse this with the id param which is not what I want
router.route("/showMe").get(userController.showCurrentUser);
router.route("/updateUser").post(userController.updateUser);
router.route("/updateUserPassword").post(userController.updateUserPassword);

// Order of Placement of this function is very important
router.route("/:id").get(userController.getSingleUser);

module.exports = router;
