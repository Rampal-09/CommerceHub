import express from "express";
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressIdParam,
} from "../middleware/addressValidation.js";

const router = express.Router();

// Apply auth middleware to protect all address routes
router.use(protect);

// Address Routes
router.post("/", validateCreateAddress, createAddress);
router.get("/", getAddresses);
router.get("/:id", validateAddressIdParam, getAddressById);
router.patch("/:id", validateUpdateAddress, updateAddress);
router.patch("/:id/default", validateAddressIdParam, setDefaultAddress);
router.delete("/:id", validateAddressIdParam, deleteAddress);

export default router;
