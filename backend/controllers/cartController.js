import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  getCartService,
  addItemToCartService,
  updateCartItemQuantityService,
  removeCartItemService,
  clearCartService,
} from "../services/cartService.js";

/**
 * @desc    Add product to cart
 * @route   POST /api/cart or /api/v1/cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform cart operations.");
    }
    const { productId, quantity } = req.body;
    const cart = await addItemToCartService(req.user._id, productId, quantity);
    return sendResponse(res, 201, "Product added to cart successfully.", cart);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get logged in user's cart
 * @route   GET /api/cart or /api/v1/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform cart operations.");
    }
    const cart = await getCartService(req.user._id);
    return sendResponse(res, 200, "Cart retrieved successfully.", cart);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Update item quantity in cart
 * @route   PATCH /api/cart/items/:productId or /api/v1/cart/items/:productId
 * @access  Private
 */
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform cart operations.");
    }
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await updateCartItemQuantityService(req.user._id, productId, quantity);
    return sendResponse(res, 200, "Cart item quantity updated successfully.", cart);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Remove single item from cart
 * @route   DELETE /api/cart/items/:productId or /api/v1/cart/items/:productId
 * @access  Private
 */
export const removeCartItem = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform cart operations.");
    }
    const { productId } = req.params;
    const cart = await removeCartItemService(req.user._id, productId);
    return sendResponse(res, 200, "Item removed from cart successfully.", cart);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart or /api/v1/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform cart operations.");
    }
    const cart = await clearCartService(req.user._id);
    return sendResponse(res, 200, "Cart cleared successfully.", cart);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

export default {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
