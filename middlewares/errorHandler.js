function errorHandler(err, req, res, next) {
  // console.log(`Incoming request: ${req.method} ${req.path}`, err);
  // Sequelize Errors
  if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors.map((e) => e.message).join(", "); // Combine all validation error messages
  } else if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = err.errors.map((e) => e.message).join(", ");
  } else if (err.name === "SequelizeDatabaseError") {
    status = 400;
    message =
      "Database Error: " +
        (err.parent?.detail ? err.parent.detail : "User doesn't exist") ||
      "Invalid query";
  }

  // Custom Errors
  else if (err.name === "Unauthorized" || err.name === "JsonWebTokenError") {
    status = 401;
    message = "Unauthorized: " + (err.message || "Invalid token");
  } else if (err.name === "BadRequest") {
    status = 400;
    message = err.message || "Bad Request";
  } else if (err.name === "NotFound") {
    status = 404;
    message = err.message || "Resource not found";
  }

  // Business Logic Errors
  else {
    status = 500;
    message = err.message || "Internal server error";
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
