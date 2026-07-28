import mongoose from "mongoose";
import { sendError } from "../utils/responseHandler.js";

// Phone validation regex (allows 7-15 digits with optional +, space, hyphen)
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

/**
 * Validate Add Address Request Body
 */
export const validateCreateAddress = (req, res, next) => {
  const errors = [];
  const {
    fullName,
    phone,
    alternatePhone,
    addressLine1,
    city,
    state,
    country,
    postalCode,
    addressType,
  } = req.body;

  // 1. Full Name required
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    errors.push("Full name is required.");
  }

  // 2. Phone required & format check
  if (!phone || typeof phone !== "string" || !phone.trim()) {
    errors.push("Phone number is required.");
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.push("Invalid phone number format.");
  }

  // 3. Alternate Phone format check if provided
  if (alternatePhone && typeof alternatePhone === "string" && alternatePhone.trim()) {
    if (!PHONE_REGEX.test(alternatePhone.trim())) {
      errors.push("Invalid alternate phone number format.");
    }
  }

  // 4. Address Line 1 required
  if (!addressLine1 || typeof addressLine1 !== "string" || !addressLine1.trim()) {
    errors.push("Address Line 1 is required.");
  }

  // 5. City required
  if (!city || typeof city !== "string" || !city.trim()) {
    errors.push("City is required.");
  }

  // 6. State required
  if (!state || typeof state !== "string" || !state.trim()) {
    errors.push("State is required.");
  }

  // 7. Country required
  if (!country || typeof country !== "string" || !country.trim()) {
    errors.push("Country is required.");
  }

  // 8. Postal Code required
  if (!postalCode || typeof postalCode !== "string" || !postalCode.trim()) {
    errors.push("Postal Code is required.");
  }

  // 9. Address Type enum check
  if (addressType && !["Home", "Work", "Other"].includes(addressType)) {
    errors.push("Address Type must be Home, Work, or Other.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Update Address Request Body & ID Parameter
 */
export const validateUpdateAddress = (req, res, next) => {
  const errors = [];
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id.trim())) {
    errors.push("Invalid Address ID format.");
  }

  const {
    fullName,
    phone,
    alternatePhone,
    addressLine1,
    city,
    state,
    country,
    postalCode,
    addressType,
  } = req.body;

  if (fullName !== undefined && (!fullName || typeof fullName !== "string" || !fullName.trim())) {
    errors.push("Full name cannot be empty.");
  }

  if (phone !== undefined) {
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.push("Phone number cannot be empty.");
    } else if (!PHONE_REGEX.test(phone.trim())) {
      errors.push("Invalid phone number format.");
    }
  }

  if (alternatePhone !== undefined && alternatePhone && typeof alternatePhone === "string" && alternatePhone.trim()) {
    if (!PHONE_REGEX.test(alternatePhone.trim())) {
      errors.push("Invalid alternate phone number format.");
    }
  }

  if (addressLine1 !== undefined && (!addressLine1 || typeof addressLine1 !== "string" || !addressLine1.trim())) {
    errors.push("Address Line 1 cannot be empty.");
  }

  if (city !== undefined && (!city || typeof city !== "string" || !city.trim())) {
    errors.push("City cannot be empty.");
  }

  if (state !== undefined && (!state || typeof state !== "string" || !state.trim())) {
    errors.push("State cannot be empty.");
  }

  if (country !== undefined && (!country || typeof country !== "string" || !country.trim())) {
    errors.push("Country cannot be empty.");
  }

  if (postalCode !== undefined && (!postalCode || typeof postalCode !== "string" || !postalCode.trim())) {
    errors.push("Postal Code cannot be empty.");
  }

  if (addressType !== undefined && !["Home", "Work", "Other"].includes(addressType)) {
    errors.push("Address Type must be Home, Work, or Other.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Address ID route parameter
 */
export const validateAddressIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id.trim())) {
    return sendError(res, 400, "Invalid Address ID format.", ["Invalid Address ID format."]);
  }

  next();
};
