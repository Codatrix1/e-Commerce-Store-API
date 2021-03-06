const jwt = require("jsonwebtoken");

// Helper function to generate jwt and sign them by passing only the "payload" as an argunent
// IMP: Here, function is setup to accept arguments as "Objects": that way I dont have to worry about the order of the args passed in

//---------------------------------------------------- Script 1)
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

//------------------------------------------------------ Script 2)
const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//------------------------------------------------------ Script 3)
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  // Sending Cookie
  res.cookie("token", token, {
    // To prevent Cross-Site Scripting Attacks: to ensure that the Browser cannot modify the cookie in any condition
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_LIFETIME * 24 * 60 * 60 * 1000
    ),
    // this code ensures, the cookie will be sent only through https:// while in production
    // thus, we can still send cookies in development with http:// for testing
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

// Exports
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
