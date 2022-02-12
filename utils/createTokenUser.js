const createTokenUser = (user) => {
  // Create token User function which accepts args coming from the controller fucntion: with the below properties
  // We are passing the "role" too, as it will be needed while setting up "role based Authentication" in later stages
  return { name: user.name, userId: user._id, role: user.role };
};

module.exports = createTokenUser;
