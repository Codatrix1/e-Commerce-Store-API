// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const userController = require("../controllers/userController");

// import authentication middleware
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//-------------
// Routes Setup
//-------------

// @desc: ❗❗ Protected and Admin Only: Level 2 Security
// Middleware function placement EXTREMLY important
router
  .route("/")
  .get(
    authenticateUser,
    authorizePermissions("admin"),
    userController.getAllUsers
  );

// @desc: ❗ Protected: Level 1 Security
// NOTE: Placement is EXTREMLY IMPORTANT while setting up the "/showMe","/updateUser" and "/updateUserPassword" route:
// else it wont work as express will confuse this with the id param which is not what I want
router.route("/showMe").get(authenticateUser, userController.showCurrentUser);
router.route("/updateUser").patch(authenticateUser, userController.updateUser);
router
  .route("/updateUserPassword")
  .patch(authenticateUser, userController.updateUserPassword);

// Order of Placement of this function is very important
router.route("/:id").get(authenticateUser, userController.getSingleUser);

//---------------
// Export router
//---------------
module.exports = router;
