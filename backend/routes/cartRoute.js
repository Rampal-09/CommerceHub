import express from "express";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateAddToCart,
  validateUpdateQuantity,
  validateProductIdParam,
} from "../middleware/cartValidation.js";

const router = express.Router();

// Apply auth middleware to protect all cart routes
router.use(protect);

// Cart routes
router.post("/", validateAddToCart, addToCart);
router.get("/", getCart);
router.patch("/items/:productId", validateUpdateQuantity, updateCartItemQuantity);
router.delete("/items/:productId", validateProductIdParam, removeCartItem);
router.delete("/", clearCart);

export default router;
