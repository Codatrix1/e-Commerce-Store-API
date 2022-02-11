const CustomErrorAPI = require("../errors");
const { isTokenValid } = require("../utils");

//--------------------------------------------
// Level 1 Security : Authenticate User
//--------------------------------------------
const authenticateUser = async (req, res, next) => {
  // assign token var to the signed token, attached to the request that we are trying to access
  const token = req.signedCookies.token;

  // If no token present
  if (!token) {
    throw new CustomErrorAPI.UnauthenticatedError("Authentication Failed");
  }

  // If token present
  try {
    // Test Code: Check later for ERRORS: Not required though
    // const payload = isTokenValid({ token });
    // console.log(payload);
    // req.user = { name: payload.name, userId: payload._id, role: payload.role };

    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomErrorAPI.UnauthenticatedError("Authentication Failed");
  }
};

//--------------------------------------------------------------------------------------------
// Level 2 Security : Authenticate user as an admin, or whatever args passed in the userRoutes
//--------------------------------------------------------------------------------------------
const authorizePermissions = (...roles) => {
  // console.log(roles); // Passed as args in the userRoutes
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErrorAPI.UnauthorizedError(
        "FORBIDDEN: You do not have permissions to perform this action"
      );
    }
    next();
  };
};

// Exports
module.exports = { authenticateUser, authorizePermissions };
