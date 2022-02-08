const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");
const { attachCookiesToResponse } = require("../utils");

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

  // By default: the first registered in the DB, user is designated as an admin: checkpoint
  // Alernative Option to set admin: Manually update field using MongoDB Atlas or Compass
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // Create new User
  const user = await User.create({ name, email, password, role });

  // Create token with the below properties and sign the token:
  // We are passing the "role" too, as it will be needed while setting up "role based Authentication" in later stages
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });

  // Send Response
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

//-------------------------------------------------------------------------
// @desc  GET Request /api/v1/auth/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // chcek for email, password
  if (!email || !password) {
    throw new CustomErrorAPI.BadRequestError(
      "Please provide email and password"
    );
  }
  // Find user in the DB
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrorAPI.UnauthenticatedError("Invalid Credentials");
  }

  // If email found in DB, check the password with compare method defined in the user model
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomErrorAPI.UnauthenticatedError("Invalid Credentials");
  }

  // Create token with the below properties and sign the token:
  // We are passing the "role" too, as it will be needed while setting up "role based Authentication" in later stages
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });

  // Send Response
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//--------------------------------------------------------------------------
// @desc  GET Request /api/v1/auth/logout
// @access Private
const logoutUser = async (req, res) => {
  //to logout user: Remove the cookie from the request
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  // json response for DEV Purposes Only
  res.status(StatusCodes.OK).json({ msg: "User Successfully Logged Out!" });
};

// export
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
