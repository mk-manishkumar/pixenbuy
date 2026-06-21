/**
 * Custom API error class with HTTP status code.
 * Throw this from services/controllers to send structured error responses.
 *
 * Usage:
 *   throw new ApiError(404, 'User not found');
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global Express error handling middleware.
 * Mount as the last middleware in server.js.
 *
 * Handles:
 *   - ApiError instances (custom status + message)
 *   - Mongoose validation errors (400)
 *   - Mongoose duplicate key errors (409)
 *   - Everything else (500)
 */
const errorHandler = (err, _req, res, _next) => {
  console.error("Server Error Details:", err);

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res
      .status(409)
      .json({ error: `Duplicate value for: ${field}` });
  }

  // Fallback
  res.status(500).json({ error: "Internal server error" });
};

export { ApiError, errorHandler };
