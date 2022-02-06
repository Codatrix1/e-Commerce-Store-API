const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");
const { createJWT } = require("../utils");

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
  const token = createJWT({ payload: tokenUser });

  // Sending Cookie
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_LIFETIME * 24 * 60 * 60 * 1000
    ),
    // To prevent Cross-Site Scripting Attacks: to ensure that the Browser cannot modify the cookie in any condition
    httpOnly: true,
  });

  // Send Response
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
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
