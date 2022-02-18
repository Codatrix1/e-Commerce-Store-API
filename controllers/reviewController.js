// import models
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// rest of the imports
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

// authentication imports
const { checkPermissions } = require("../utils");

//-----------------------------------------------
// @ Desc      Get all reviews
// @ Route     GET /api/v1/reviews
// @ Access    Public

const getAllReviews = async (req, res, next) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

//------------------------------------------------
// @ Desc      Get single review
// @ Route     GET /api/v1/reviews/:id
// @ Access    Public

const getSingleReview = async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomErrorAPI.NotFoundError(
      `No review found with the ID of ${reviewId}`
    );
  }

  res.status(StatusCodes.OK).json({ review });
};

//------------------------------------------------
// @ Desc      Create review
// @ Route     POST /api/v1/reviews
// @ Access    Private

const createReview = async (req, res, next) => {
  // 1) destructure the incoming request , check for productId and manually re-assign values
  const { product: productId } = req.body;

  // 2) check if the product exists in the DB
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomErrorAPI.NotFoundError(
      `No product found with the ID of ${productId}`
    );
  }
  // 3) WE check the role as "user" OR "admin" in our cookie and then proceed with the below code
  // Manually re-assign the property coming from req.body attaching a user to it
  req.body.user = req.user.userId;

  // 4) Check if the "current logged in user" has already left a "review" on the "specific product"
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadyReviewed) {
    throw new CustomErrorAPI.BadRequestError(
      "Already submitted a review for this product"
    );
  }

  // 5) Create Review
  const review = await Review.create(req.body);

  // Response
  res.status(StatusCodes.CREATED).json({ review });
};

//-------------------------------------------------
// @ Desc      Update review
// @ Route     PATCH /api/v1/reviews/:id
// @ Access    Private

const updateReview = async (req, res, next) => {
  res.send("Update Review");
};

//-------------------------------------------------
// @ Desc      Delete review
// @ Route     Delete /api/v1/reviews/:id
// @ Access    Private

const deleteReview = async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomErrorAPI.NotFoundError(
      `No review found with the ID of ${reviewId}`
    );
  }

  // WE check for permissions
  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

//-----------
// Exports
//-----------
module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};
