const CustomErrorAPI = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser);
  //   console.log(resourceUserId);
  //   console.log(typeof resourceUserId);

  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new CustomErrorAPI.UnauthorizedError(
    "ACCESS DENIED: You do not have the permissions to perform this action"
  );
};

// Exports
module.exports = checkPermissions;
