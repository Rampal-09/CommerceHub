/**
 * Centralized API response helper for consistent JSON structure
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, 400, 404, 500, etc.)
 * @param {string} message - Human-readable status message
 * @param {any} [data=null] - Payload object or array
 * @param {Object} [extras={}] - Extra metadata (e.g. pagination)
 */
export const sendResponse = (res, statusCode, message, data = null, extras = {}) => {
  const success = statusCode >= 200 && statusCode < 300;
  const responsePayload = {
    success,
    message,
    ...(data !== null && { data }),
    ...extras,
  };
  return res.status(statusCode).json(responsePayload);
};

/**
 * Centralized error response helper
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Primary error message
 * @param {Array<string>} [errors=null] - Detailed list of validation errors
 */
export const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export default {
  sendResponse,
  sendError,
};
