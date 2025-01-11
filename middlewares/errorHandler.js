function errorHandler(err, req, res, next) {
  const status = err.name === "Unauthorized" ? 401 : 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
