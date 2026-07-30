import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  checkIsWishlisted,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateAddToWishlist,
  validateProductIdParam,
} from "../middleware/wishlistValidation.js";

const router = express.Router();

// Apply auth middleware to protect all wishlist routes
router.use(protect);

// Wishlist Routes
router.post("/", validateAddToWishlist, addToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", validateProductIdParam, removeFromWishlist);
router.delete("/", clearWishlist);
router.get("/check/:productId", validateProductIdParam, checkIsWishlisted);

export default router;
