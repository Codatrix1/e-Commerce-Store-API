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

module.exports = {
  createJWT,
  isTokenValid,
};
