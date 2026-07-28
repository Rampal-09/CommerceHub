import mongoose from "mongoose";
import { sendError } from "../utils/responseHandler.js";

/**
 * Validate Add to Wishlist Request Body
 */
export const validateAddToWishlist = (req, res, next) => {
  const { productId } = req.body;

  if (!productId || typeof productId !== "string" || !productId.trim()) {
    return sendError(res, 400, "Product ID is required.", ["Product ID is required."]);
  }

  if (!mongoose.Types.ObjectId.isValid(productId.trim())) {
    return sendError(res, 400, "Invalid Product ID format.", ["Invalid Product ID format."]);
  }

  next();
};

/**
 * Validate Product ID route parameter
 */
export const validateProductIdParam = (req, res, next) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId.trim())) {
    return sendError(res, 400, "Invalid Product ID format.", ["Invalid Product ID format."]);
  }

  next();
};
