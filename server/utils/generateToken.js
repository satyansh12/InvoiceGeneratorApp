const jwt = require('jsonwebtoken');

/**
 * generateToken.js generates JWT tokens for user authentication.
 * It's utilized across the application for creating tokens during user login and registration.
 */
const generateToken = (user) => {
  return jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = generateToken;
