const jwt = require('jsonwebtoken');

/**
 * isAuthenticated.js is a middleware to check if the user's JWT token is valid.
 * It's used in routes that require user authentication to protect them against unauthorized access.
 */
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("Unauthorized: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token expired");
        return res.status(401).json({ message: "Token expired" });
      }
      console.log("Forbidden: Invalid token");
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = isAuthenticated;