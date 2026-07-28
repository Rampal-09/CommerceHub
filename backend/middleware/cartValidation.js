import mongoose from "mongoose";
import { sendError } from "../utils/responseHandler.js";

/**
 * Validate Add to Cart Request Body
 * POST /api/cart
 */
export const validateAddToCart = (req, res, next) => {
  const errors = [];
  const { productId, quantity } = req.body;

  // 1. Validate productId
  if (!productId || typeof productId !== "string" || !productId.trim()) {
    errors.push("Product ID is required.");
  } else if (!mongoose.Types.ObjectId.isValid(productId.trim())) {
    errors.push("Invalid Product ID format.");
  }

  // 2. Validate quantity
  if (quantity === undefined || quantity === null || quantity === "") {
    errors.push("Quantity is required.");
  } else {
    const numQty = Number(quantity);
    if (isNaN(numQty) || !Number.isInteger(numQty) || numQty < 1) {
      errors.push("Quantity must be a positive integer greater than or equal to 1.");
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Update Quantity Request
 * PATCH /api/cart/items/:productId
 */
export const validateUpdateQuantity = (req, res, next) => {
  const errors = [];
  const { productId } = req.params;
  const { quantity } = req.body;

  // 1. Validate productId URL parameter
  if (!productId || !mongoose.Types.ObjectId.isValid(productId.trim())) {
    errors.push("Invalid Product ID format.");
  }

  // 2. Validate quantity
  if (quantity === undefined || quantity === null || quantity === "") {
    errors.push("Quantity is required.");
  } else {
    const numQty = Number(quantity);
    if (isNaN(numQty) || !Number.isInteger(numQty) || numQty < 1) {
      errors.push("Quantity must be a positive integer greater than or equal to 1.");
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Product ID parameter for route params
 * DELETE /api/cart/items/:productId
 */
export const validateProductIdParam = (req, res, next) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId.trim())) {
    return sendError(res, 400, "Invalid Product ID format.", ["Invalid Product ID format."]);
  }

  next();
};
