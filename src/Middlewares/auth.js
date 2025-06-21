require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Authentication failed: No token provided." });
    }
    
    const decodedToken = jwt.verify(token, "mysecretkey");
    if (!decodedToken) {
      return res.status(401).send({ message: "Authentication failed: Invalid token." });
    }
    
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: "Authentication failed: Malformed token." });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: "Authentication failed: Token has expired." });
    }
    res.status(500).send({ message: "An internal server error occurred during authentication." });
  }
};

module.exports = {
  auth,
};
