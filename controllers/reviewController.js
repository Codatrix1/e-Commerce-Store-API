const Review = require("../models/reviewModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

// @ Desc      Get all reviews
// @ Route     GET /api/v1/reviews
// @ Access    Public
const getAllReviews = async (req, res, next) => {
  res.send("Get All Reviews");
};

// @ Desc      Get single review
// @ Route     GET /api/v1/reviews/:id
// @ Access    Public
const getSingleReview = async (req, res, next) => {
  res.send("Get Single Review");
};

// @ Desc      Create review
// @ Route     POST /api/v1/reviews
// @ Access    Private
const createReview = async (req, res, next) => {
  res.send("Create Review");
};

// @ Desc      Update review
// @ Route     PATCH /api/v1/reviews/:id
// @ Access    Private
const updateReview = async (req, res, next) => {
  res.send("Update Review");
};

// @ Desc      Delete review
// @ Route     Delete /api/v1/reviews/:id
// @ Access    Private
const deleteReview = async (req, res, next) => {
  res.send("Delete Review");
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
