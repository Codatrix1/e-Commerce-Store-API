const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

//------------------------------------------------
const getAllUsers = async (req, res) => {
  // console.log(req.user);
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

//--------------------------------------------------
const updateUser = async (req, res) => {
  // Name and email
  res.send(req.body);
};

//--------------------------------------------------
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // check for oldPassword, newPassword in the body
  if (!oldPassword || !newPassword) {
    throw new CustomErrorAPI.BadRequestError(
      "Please provide the old password and the new password"
    );
  }

  // As the user already exists in the DB, since this route is aleady authenticated before being hit, No need to ckeck if the user exists as we already know, He is in the DB

  // userId is aleady present in the token, since we set it up that way while passing the payload
  const user = await User.findOne({ _id: req.user.userId });

  // Find the _id of the user in the DB, and check the inputted "oldPassword" with compare method defined in the user model
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomErrorAPI.UnauthenticatedError("Invalid Credentials");
  }

  // If All Checks out correctly, reassign the password and update the new password in the DB using the save() : Instance Method on the current doc
  user.password = newPassword;

  await user.save();
  // res.send();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
