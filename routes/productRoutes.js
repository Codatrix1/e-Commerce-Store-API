// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const productController = require("../controllers/productController");

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
  .get(productController.getAllProducts)
  .post(
    [authenticateUser, authorizePermissions("admin")],
    productController.createProduct
  );

//---------------------------------------------------
// Dedicated Route for "/api/v1/products/uploadImage"
//----------------------------------------------------
router
  .route("/uploadImage")
  .post(
    [authenticateUser, authorizePermissions("admin")],
    productController.uploadImage
  );

//-------------------------------
// Root Routes with params Setup
//-------------------------------
router
  .route("/:id")
  .get(productController.getSingleProduct)
  .patch(
    [authenticateUser, authorizePermissions("admin")],
    productController.updateProduct
  )
  .delete(
    [authenticateUser, authorizePermissions("admin")],
    productController.deleteProduct
  );

//---------------
// Export Router
//---------------
module.exports = router;
