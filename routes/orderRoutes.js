// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const orderController = require("../controllers/orderController");

// import authentication middleware
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//--------------------
// Root Routes Setup
//---------------------
router
  .route("/")
  .get(
    [authenticateUser, authorizePermissions("admin")],
    orderController.getAllOrders
  )
  .post(authenticateUser, orderController.createOrder);

// Placement of a dedicated route must be above routes that contains "params", else the dedicated route will be treated as a parameterized route, which we DO NOT WANT AT ALL
router
  .route("/showAllMyOrders")
  .get(authenticateUser, orderController.getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, orderController.getSingleOrder)
  .patch(authenticateUser, orderController.updateOrder);

//-------------
// Exports
//-------------
module.exports = router;
