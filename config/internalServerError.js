const internalServerError = (res, err) => {
  res.json({
    success: false,
    message: "Internal server error " + err.message,
  });
};

module.exports = internalServerError;
