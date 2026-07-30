import express from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getAdminDashboardStats,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, roleMiddleware("admin"));

router.get("/dashboard", getAdminDashboardStats);
router.get("/orders", getAllOrders);
router.patch("/orders/:id", updateOrderStatus);

export default router;
