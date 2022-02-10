const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

//------------------------------------------------
const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

//-------------------------------------------------
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomErrorAPI.NotFoundError(
      `No user with found with the ID: ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.send("Show Current User");
};

const updateUser = async (req, res) => {
  // Name and email
  res.send(req.body);
};

const updateUserPassword = async (req, res) => {
  res.send(req.body);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
