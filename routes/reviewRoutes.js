// express and router invoking
const express = require("express");
const router = express.Router();

// import controller
const reviewController = require("../controllers/reviewController");

// import authentication middleware
const { authenticateUser } = require("../middleware/authentication");

//--------------------
// Root Routes Setup
//---------------------
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authenticateUser, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getSingleReview)
  .patch(authenticateUser, reviewController.updateReview)
  .delete(authenticateUser, reviewController.deleteReview);

//----------
// Exports
//----------
module.exports = router;
