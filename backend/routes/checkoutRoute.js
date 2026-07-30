import express from "express";
import {
  getCheckoutSummary,
  placeOrder,
} from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validatePlaceOrder } from "../middleware/checkoutValidation.js";

const router = express.Router();

// Apply auth middleware to protect all checkout routes
router.use(protect);

// Checkout Routes
router.get("/", getCheckoutSummary);
router.post("/place-order", validatePlaceOrder, placeOrder);

export default router;
