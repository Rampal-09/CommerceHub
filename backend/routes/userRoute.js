import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  getOrders,
  getOrderById,
  getWishlist,
  getDashboardStats,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateUpdateProfile,
  validateChangePassword,
} from "../middleware/userValidation.js";
import { upload, handleMulterError } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply auth middleware to protect all user profile routes
router.use(protect);

// Profile Routes
router.get("/profile", getProfile);
router.patch("/profile", validateUpdateProfile, updateProfile);

// Avatar Upload & Delete Routes
router.patch("/profile/avatar", upload.single("avatar"), handleMulterError, uploadAvatar);
router.delete("/profile/avatar", removeAvatar);

// Change Password Route
router.patch("/change-password", validateChangePassword, changePassword);

// Orders History Routes
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);

// Wishlist Route
router.get("/wishlist", getWishlist);

// Dashboard Statistics Route
router.get("/dashboard", getDashboardStats);

export default router;
