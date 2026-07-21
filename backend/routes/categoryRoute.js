import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import { upload, handleMulterError } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, roleMiddleware("admin"), upload.single("image"), handleMulterError, createCategory);
router.patch("/:id", protect, roleMiddleware("admin"), upload.single("image"), handleMulterError, updateCategory);
router.delete("/:id", protect, roleMiddleware("admin"), deleteCategory);

export default router;
