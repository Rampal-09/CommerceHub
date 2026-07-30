import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import { uploadProductFiles, handleMulterError } from "../middleware/uploadMiddleware.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middleware/productValidation.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Protected Routes
router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  uploadProductFiles,
  handleMulterError,
  validateCreateProduct,
  createProduct
);

router.patch(
  "/:id",
  protect,
  roleMiddleware("admin"),
  uploadProductFiles,
  handleMulterError,
  validateUpdateProduct,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteProduct
);

export default router;
