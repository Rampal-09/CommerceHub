import mongoose from "mongoose";
import Category from "../modals/categorySchema.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * Helper function to generate a URL-friendly slug from string
 * Example: "Home Kitchen & Appliances" -> "home-kitchen-appliances"
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters except spaces and dashes
    .replace(/\s+/g, "-")        // Replace spaces with dashes
    .replace(/-+/g, "-");        // Replace multiple dashes with single dash
};

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  let uploadedImage = null;

  try {
    const { name, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const trimmedName = name.trim();

    // Case-insensitive check for existing category name
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    const slug = generateSlug(trimmedName);

    // Upload image to Cloudinary if provided
    if (req.file) {
      uploadedImage = await uploadToCloudinary(req.file.buffer, "categories");
    }

    const categoryData = {
      name: trimmedName,
      slug,
      isActive: isActive !== undefined ? String(isActive) === "true" || isActive === true : true,
    };

    if (uploadedImage) {
      categoryData.image = uploadedImage;
    }

    const category = await Category.create(categoryData);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    // Cleanup uploaded Cloudinary image if DB save fails
    if (uploadedImage?.public_id) {
      await deleteFromCloudinary(uploadedImage.public_id).catch((err) =>
        console.error("Cleanup error after category creation failure:", err)
      );
    }

    console.error("Create Category Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating category.",
    });
  }
};

/**
 * @desc    Get all categories (Active only by default)
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    // Return active categories by default unless includeInactive query param is true
    const filter = req.query.includeInactive === "true" ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error fetching categories.",
    });
  }
};

/**
 * @desc    Get single category by ID
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error fetching category details.",
    });
  }
};

/**
 * @desc    Update a category
 * @route   PATCH /api/v1/categories/:id (or PUT)
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  let newUploadedImage = null;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const { name, isActive } = req.body;

    // Handle Name & Slug Update
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty.",
        });
      }

      const trimmedName = name.trim();

      if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
        const existingCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
          _id: { $ne: id },
        });

        if (existingCategory) {
          return res.status(409).json({
            success: false,
            message: "Another category with this name already exists.",
          });
        }

        category.name = trimmedName;
        category.slug = generateSlug(trimmedName);
      }
    }

    // Handle Status Update
    if (isActive !== undefined) {
      category.isActive = String(isActive) === "true" || isActive === true;
    }

    // Handle New Image Upload
    if (req.file) {
      newUploadedImage = await uploadToCloudinary(req.file.buffer, "categories");

      // Delete old Cloudinary image if it exists
      if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id).catch((err) =>
          console.error("Failed to delete previous category image:", err)
        );
      }

      category.image = newUploadedImage;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    // Cleanup newly uploaded Cloudinary image if save fails
    if (newUploadedImage?.public_id) {
      await deleteFromCloudinary(newUploadedImage.public_id).catch((err) =>
        console.error("Cleanup error after update failure:", err)
      );
    }

    console.error("Update Category Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error updating category.",
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Delete image from Cloudinary first if present
    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    // Delete MongoDB document
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error deleting category.",
    });
  }
};
