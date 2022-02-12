const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

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

//--------------------------------------------------
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//-------------------------------------------
// @desc update user: Method 1: with findOneAndUpdate
//--------------------------------------------------
/*
const updateUser = async (req, res) => {
  // Check for Only name and email: Since we want to update these two fields
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomErrorAPI.BadRequestError("Please provide name and email");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email: email, name: name },
    {
      new: true,
      runValidators: true,
    }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  // Send Response
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

*/

//---------------------------------------------------------------
// @desc update user: Method 2: with user.save() Instance Method
//---------------------------------------------------------------

const updateUser = async (req, res) => {
  // Check for Only name and email: Since we want to update these two fields
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomErrorAPI.BadRequestError("Please provide name and email");
  }

  const user = await User.findOne({ _id: req.user.userId });

  // Updating the properties manually
  user.name = name;
  user.email = email;

  // Instance method on the current document
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  // Send Response
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//--------------------------------------------------
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // check for oldPassword, newPassword in the body
  if (!oldPassword || !newPassword) {
    throw new CustomErrorAPI.BadRequestError(
      "Please provide the old password and a new password"
    );
  }

  // As the user already exists in the DB, since this route is aleady authenticated before this route being hit, No need to check if the user exists as we already know, He/She is in the DB

  // userId is already present in the token, since we set it up that way while passing the payload
  const user = await User.findOne({ _id: req.user.userId });

  // Find the _id of the user in the DB, and check the inputted "oldPassword" with compare [Instance] method defined in the user model
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomErrorAPI.UnauthenticatedError("Invalid Credentials");
  }

  // If All Checks out correctly, re-assign the password and update the new password in the DB using the save() : Instance Method on the current doc
  user.password = newPassword;

  await user.save();
  // res.send();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

//----------------
// Exports
//----------------
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
