import { sendError } from "../utils/responseHandler.js";

/**
 * Global Express Error Handling Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error.";
  let errors = err.errors || null;

  // Handle Mongoose Invalid ObjectId CastError
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found. Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const keys = Object.keys(err.keyValue || {});
    message = `Duplicate field value entered for: ${keys.join(", ")}.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = errors[0] || "Validation failed.";
  }

  return sendError(res, statusCode, message, errors);
};

export default errorMiddleware;
