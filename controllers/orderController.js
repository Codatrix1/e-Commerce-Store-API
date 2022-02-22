const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

//-------------------------------------------------------------
// @ desc       Get all orders
// @ route      GET /api/v1/orders
// @ access     Private [Admin Only]
const getAllOrders = async (req, res, next) => {
  res.send("Get all orders");
};

//-------------------------------------------------------------
// @ desc       Get Single order
// @ route      GET /api/v1/orders/:id
// @ access     Private
const getSingleOrder = async (req, res, next) => {
  res.send("Get Single Order");
};

//-------------------------------------------------------------
// @ desc       Get Current User orders
// @ route      GET /api/v1/orders/showAllMyOrders
// @ access     Private
const getCurrentUserOrders = async (req, res, next) => {
  res.send("Get Current User Orders");
};

//-------------------------------------------------------------
// @ desc       Get all orders
// @ route      POST /api/v1/orders
// @ access     Private
const createOrder = async (req, res, next) => {
  res.send("Create order");
};

//-------------------------------------------------------------
// @ desc       Update order
// @ route      PATCH /api/v1/orders/:id
// @ access     Private
const updateOrder = async (req, res, next) => {
  res.send("Update order");
};

//--------
// Exports
//--------
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
