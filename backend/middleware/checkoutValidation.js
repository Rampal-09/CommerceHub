import mongoose from "mongoose";
import { sendError } from "../utils/responseHandler.js";

/**
 * Validate Place Order Request Body
 */
export const validatePlaceOrder = (req, res, next) => {
  const errors = [];
  const { shippingAddressId, paymentMethod } = req.body;

  // 1. Validate shippingAddressId
  if (!shippingAddressId || typeof shippingAddressId !== "string" || !shippingAddressId.trim()) {
    errors.push("Shipping address ID is required.");
  } else if (!mongoose.Types.ObjectId.isValid(shippingAddressId.trim())) {
    errors.push("Invalid Shipping Address ID format.");
  }

  // 2. Validate paymentMethod if provided
  if (paymentMethod && !["COD", "Card", "UPI", "NetBanking"].includes(paymentMethod)) {
    errors.push("Invalid payment method. Allowed values: COD, Card, UPI, NetBanking.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};
