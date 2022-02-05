const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");
const jwt = require("jsonwebtoken");

//-----------------------------------------------------------------------
// @desc  POST Request /api/v1/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  // check if user already exists in DB
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomErrorAPI.BadRequestError("Email already exists");
  }

  // first registered user is an admin: checkpoint
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // Create new User
  const user = await User.create({ name, email, password, role });

  // Create token with the below properties and sign the token
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  const token = jwt.sign(tokenUser, "jwtSecret", { expiresIn: "30d" });

  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

//-------------------------------------------------------------------------
// @desc  GET Request /api/v1/auth/login
// @access Public
const loginUser = async (req, res) => {
  res.send("login user");
};

//--------------------------------------------------------------------------
// @desc  GET Request /api/v1/auth/logout
// @access Private
const logoutUser = async (req, res) => {
  res.send("logout user");
};

// export
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
