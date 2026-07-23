import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
  clearWishlistService,
  isWishlistedService,
} from "../services/wishlistService.js";

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist or /api/v1/wishlist
 * @access  Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform wishlist operations.");
    }
    const { productId } = req.body;
    const wishlist = await addToWishlistService(req.user._id, productId);
    return sendResponse(res, 201, "Product added to wishlist.", wishlist);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get logged-in user's wishlist
 * @route   GET /api/wishlist or /api/v1/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform wishlist operations.");
    }
    const wishlist = await getWishlistService(req.user._id);
    return sendResponse(res, 200, "Wishlist retrieved successfully.", wishlist);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Remove single product from wishlist
 * @route   DELETE /api/wishlist/:productId or /api/v1/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform wishlist operations.");
    }
    const { productId } = req.params;
    const wishlist = await removeFromWishlistService(req.user._id, productId);
    return sendResponse(res, 200, "Product removed from wishlist.", wishlist);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist or /api/v1/wishlist
 * @access  Private
 */
export const clearWishlist = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform wishlist operations.");
    }
    const wishlist = await clearWishlistService(req.user._id);
    return sendResponse(res, 200, "Wishlist cleared successfully.", wishlist);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Check if a product is in user's wishlist
 * @route   GET /api/wishlist/check/:productId or /api/v1/wishlist/check/:productId
 * @access  Private
 */
export const checkIsWishlisted = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return sendError(res, 403, "Admins are not permitted to perform wishlist operations.");
    }
    const { productId } = req.params;
    const result = await isWishlistedService(req.user._id, productId);
    return sendResponse(res, 200, "Wishlist check complete.", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

export default {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  checkIsWishlisted,
};
