import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  getCheckoutSummaryService,
  placeOrderService,
} from "../services/checkoutService.js";

/**
 * @desc    Get pre-checkout summary data (cart, addresses, pricing)
 * @route   GET /api/checkout
 * @access  Private
 */
export const getCheckoutSummary = async (req, res, next) => {
  try {
    const summary = await getCheckoutSummaryService(req.user._id, req.query.addressId);
    return sendResponse(res, 200, "Checkout summary retrieved successfully.", summary);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Place an order from cart items and shipping address
 * @route   POST /api/checkout/place-order
 * @access  Private
 */
export const placeOrder = async (req, res, next) => {
  try {
    const order = await placeOrderService(req.user._id, req.body);
    return sendResponse(res, 201, "Order placed successfully!", order);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

export default {
  getCheckoutSummary,
  placeOrder,
};
