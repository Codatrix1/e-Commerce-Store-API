const jwt = require("jsonwebtoken");

// Helper function to generate jwt and sign them by passing only the "payload" as an argunent
// IMP: Here, function is setup to accept arguments as "Objects": that way I dont have to worry about the order of the args passed in

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  // Sending Cookie
  res.cookie("token", token, {
    // To prevent Cross-Site Scripting Attacks: to ensure that the Browser cannot modify the cookie in any condition
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_LIFETIME * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
