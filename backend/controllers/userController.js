import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  getUserProfileService,
  updateUserProfileService,
  uploadUserAvatarService,
  removeUserAvatarService,
  changeUserPasswordService,
  getUserOrdersService,
  getUserOrderByIdService,
  getUserWishlistService,
  getUserDashboardStatsService,
} from "../services/userService.js";

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService(req.user._id);
    return sendResponse(res, 200, "User profile retrieved successfully.", user);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Update profile details
 * @route   PATCH /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateUserProfileService(req.user._id, req.body);
    return sendResponse(res, 200, "Profile updated successfully.", updatedUser);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Upload or update profile avatar image
 * @route   PATCH /api/users/profile/avatar
 * @access  Private
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return sendError(res, 400, "Please upload an image file.");
    }

    const updatedUser = await uploadUserAvatarService(req.user._id, req.file.buffer);
    return sendResponse(res, 200, "Profile avatar updated successfully.", updatedUser);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Remove profile avatar image
 * @route   DELETE /api/users/profile/avatar
 * @access  Private
 */
export const removeAvatar = async (req, res, next) => {
  try {
    const updatedUser = await removeUserAvatarService(req.user._id);
    return sendResponse(res, 200, "Profile avatar removed successfully.", updatedUser);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Change account password
 * @route   PATCH /api/users/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const result = await changeUserPasswordService(req.user._id, req.body);
    return sendResponse(res, 200, result.message || "Password changed successfully.");
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get logged-in user order history (paginated)
 * @route   GET /api/users/orders
 * @access  Private
 */
export const getOrders = async (req, res, next) => {
  try {
    const data = await getUserOrdersService(req.user._id, req.query);
    return sendResponse(res, 200, "User orders retrieved successfully.", data);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get single order details by ID
 * @route   GET /api/users/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await getUserOrderByIdService(req.user._id, req.params.id);
    return sendResponse(res, 200, "Order details retrieved successfully.", order);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get logged-in user's wishlist
 * @route   GET /api/users/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getUserWishlistService(req.user._id);
    return sendResponse(res, 200, "Wishlist retrieved successfully.", wishlist);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get user account dashboard statistics
 * @route   GET /api/users/dashboard
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getUserDashboardStatsService(req.user._id);
    return sendResponse(res, 200, "Dashboard statistics retrieved successfully.", stats);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  getOrders,
  getOrderById,
  getWishlist,
  getDashboardStats,
};
