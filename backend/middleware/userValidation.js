import { sendError } from "../utils/responseHandler.js";

/**
 * Validate Update Profile Request Payload
 */
export const validateUpdateProfile = (req, res, next) => {
  const errors = [];
  const { name, phone, gender, dateOfBirth } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
      errors.push("Name must be between 2 and 50 characters long.");
    }
  }

  if (phone !== undefined && phone !== "") {
    const phoneRegex = /^[0-9+\s\-()]{7,15}$/;
    if (typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
      errors.push("Please provide a valid phone number (7-15 digits).");
    }
  }

  if (gender !== undefined && gender !== "") {
    const validGenders = ["Male", "Female", "Other", "Prefer not to say"];
    if (!validGenders.includes(gender)) {
      errors.push(`Gender must be one of: ${validGenders.join(", ")}.`);
    }
  }

  if (dateOfBirth !== undefined && dateOfBirth !== "") {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push("Please provide a valid date for Date of Birth.");
    } else if (dob > new Date()) {
      errors.push("Date of Birth cannot be in the future.");
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Change Password Request Payload
 */
export const validateChangePassword = (req, res, next) => {
  const errors = [];
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || typeof currentPassword !== "string") {
    errors.push("Current password is required.");
  }

  if (!newPassword || typeof newPassword !== "string") {
    errors.push("New password is required.");
  } else {
    if (newPassword.length < 6) {
      errors.push("New password must be at least 6 characters long.");
    }
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      errors.push("New password must contain both letters and numbers.");
    }
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    errors.push("Confirm password is required.");
  } else if (newPassword !== confirmPassword) {
    errors.push("New password and confirm password do not match.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};
