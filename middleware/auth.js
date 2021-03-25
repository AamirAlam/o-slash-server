const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      req.user = decoded.user;
      next();
    });
  } catch (error) {
    console.log("auth middlewere error");
    res.status(500).json({ message: "Server Error" });
  }
};
