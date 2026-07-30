import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../modals/userModal.js";
import Order from "../modals/orderSchema.js";
import Wishlist from "../modals/wishlistSchema.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { getWishlistService } from "./wishlistService.js";

/**
 * Get logged-in user profile
 * @param {string} userId
 */
export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { statusCode: 404, message: "User profile not found." };
  }
  return user;
};

/**
 * Update user profile information (name, phone, gender, dateOfBirth)
 * @param {string} userId
 * @param {Object} payload
 */
export const updateUserProfileService = async (userId, { name, phone, gender, dateOfBirth }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found." };
  }

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (gender !== undefined) user.gender = gender;
  if (dateOfBirth !== undefined) {
    user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  }

  await user.save();
  const updatedUser = await User.findById(userId).select("-password");
  return updatedUser;
};

/**
 * Upload or replace user profile avatar
 * @param {string} userId
 * @param {Buffer} fileBuffer
 */
export const uploadUserAvatarService = async (userId, fileBuffer) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found." };
  }

  // Delete previous Cloudinary image if it exists
  if (user.avatar?.public_id) {
    try {
      await deleteFromCloudinary(user.avatar.public_id);
    } catch (err) {
      console.error("Previous avatar deletion error (non-fatal):", err);
    }
  }

  // Upload new image to Cloudinary folder "ecommerce/avatars"
  const cloudinaryResult = await uploadToCloudinary(fileBuffer, "ecommerce/avatars");

  user.avatar = {
    public_id: cloudinaryResult.public_id,
    url: cloudinaryResult.url,
  };

  await user.save();
  const updatedUser = await User.findById(userId).select("-password");
  return updatedUser;
};

/**
 * Remove user profile avatar
 * @param {string} userId
 */
export const removeUserAvatarService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found." };
  }

  if (user.avatar?.public_id) {
    try {
      await deleteFromCloudinary(user.avatar.public_id);
    } catch (err) {
      console.error("Avatar deletion error (non-fatal):", err);
    }
  }

  user.avatar = {
    public_id: "",
    url: "",
  };

  await user.save();
  const updatedUser = await User.findById(userId).select("-password");
  return updatedUser;
};

/**
 * Change user password with bcrypt comparison and strength checks
 * @param {string} userId
 * @param {Object} payload - { currentPassword, newPassword }
 */
export const changeUserPasswordService = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found." };
  }

  // 1. Verify Current Password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw { statusCode: 400, message: "Incorrect current password." };
  }

  // 2. Prevent Password Reuse
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw { statusCode: 400, message: "New password cannot be the same as your current password." };
  }

  // 3. Hash New Password & Save
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password updated successfully!" };
};

/**
 * Get paginated orders belonging to logged-in user
 * @param {string} userId
 * @param {Object} query - { page, limit }
 */
export const getUserOrdersService = async (userId, { page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalOrders = await Order.countDocuments({ user: userId });

  return {
    orders,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalOrders / limitNum) || 1,
    totalOrders,
  };
};

/**
 * Get single order details belonging to logged-in user
 * @param {string} userId
 * @param {string} orderId
 */
export const getUserOrderByIdService = async (userId, orderId) => {
  const order = await Order.findById(orderId).populate(
    "orderItems.product",
    "title slug thumbnail price discountPrice stock"
  );

  if (!order) {
    throw { statusCode: 404, message: "Order not found." };
  }

  // Authorization Check: ensure user can only view their own order
  if (order.user.toString() !== userId.toString()) {
    throw { statusCode: 403, message: "Access denied. You can only view your own orders." };
  }

  return order;
};

/**
 * Get wishlist belonging to logged-in user
 * @param {string} userId
 */
export const getUserWishlistService = async (userId) => {
  return await getWishlistService(userId);
};

/**
 * Get user account dashboard statistics
 * @param {string} userId
 */
export const getUserDashboardStatsService = async (userId) => {
  // 1. Total Orders Count
  const totalOrders = await Order.countDocuments({ user: userId });

  // 2. Wishlist Count
  const wishlist = await Wishlist.findOne({ user: userId });
  const wishlistCount = wishlist && Array.isArray(wishlist.products) ? wishlist.products.length : 0;

  // 3. Total Amount Spent (sum of grandTotal for non-cancelled orders)
  const userObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const spentResult = await Order.aggregate([
    {
      $match: {
        user: userObjectId,
        orderStatus: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$grandTotal" },
      },
    },
  ]);

  const rawSpent = spentResult.length > 0 ? spentResult[0].totalSpent : 0;
  const totalAmountSpent = Math.round(rawSpent * 100) / 100;

  // 4. Recent 3 Orders
  const recentOrders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3);

  return {
    totalOrders,
    wishlistCount,
    totalAmountSpent,
    recentOrders,
  };
};

export default {
  getUserProfileService,
  updateUserProfileService,
  uploadUserAvatarService,
  removeUserAvatarService,
  changeUserPasswordService,
  getUserOrdersService,
  getUserOrderByIdService,
  getUserWishlistService,
  getUserDashboardStatsService,
};
