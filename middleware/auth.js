const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization || req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to authorized user " + err.message,
    });
  }
};

module.exports = auth;
