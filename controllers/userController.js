const getAllUsers = async (req, res) => {
  res.send("Get All Users");
};

const getSingleUser = async (req, res) => {
  res.send("Get Single User");
};

const showCurrentUser = async (req, res) => {
  res.send("Show Current User");
};

const updateUser = async (req, res) => {
  // Name and email
  res.send("Update username and email");
};

const updateUserPassword = async (req, res) => {
  res.send("Update user password");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
