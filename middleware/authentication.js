const CustomErrorAPI = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  // assign token var to the signed token, attached to the request that we are trying to access
  const token = req.signedCookies.token;

  // If no token present
  if (!token) {
    throw new CustomErrorAPI.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomErrorAPI.UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = { authenticateUser };
