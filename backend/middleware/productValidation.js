import mongoose from "mongoose";
import { sendError } from "../utils/responseHandler.js";

/**
 * Validate Product Creation Request
 */
export const validateCreateProduct = (req, res, next) => {
  const errors = [];
  const { title, description, category, price, discountPrice, stock } = req.body;

  // 1. Title required
  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("Product title is required.");
  }

  // 2. Description required
  if (!description || typeof description !== "string" || !description.trim()) {
    errors.push("Product description is required.");
  }

  // 3. Category required & valid ObjectId
  if (!category || !category.toString().trim()) {
    errors.push("Product category is required.");
  } else if (!mongoose.Types.ObjectId.isValid(category)) {
    errors.push("Invalid category ID format.");
  }

  // 4. Price required & > 0
  const numPrice = Number(price);
  if (price === undefined || price === null || price === "" || isNaN(numPrice)) {
    errors.push("Product price is required.");
  } else if (numPrice <= 0) {
    errors.push("Product price must be greater than 0.");
  }

  // 5. Stock cannot be negative
  const numStock = Number(stock);
  if (stock !== undefined && stock !== null && stock !== "") {
    if (isNaN(numStock) || numStock < 0) {
      errors.push("Stock quantity cannot be negative.");
    }
  }

  // 6. Discount price cannot exceed price & cannot be negative
  if (discountPrice !== undefined && discountPrice !== null && discountPrice !== "") {
    const numDiscount = Number(discountPrice);
    if (isNaN(numDiscount) || numDiscount < 0) {
      errors.push("Discount price cannot be negative.");
    } else if (!isNaN(numPrice) && numDiscount > numPrice) {
      errors.push("Discount price cannot exceed product price.");
    }
  }

  // 7. Thumbnail required while creating a product
  const hasThumbnailFile =
    req.files?.thumbnail?.[0] ||
    (req.file && req.file.fieldname === "thumbnail") ||
    req.body.thumbnail;

  if (!hasThumbnailFile) {
    errors.push("Product thumbnail image is required.");
  }

  // 8. Maximum 5 product images
  const imagesFilesCount = req.files?.images ? req.files.images.length : 0;
  const bodyImagesCount = Array.isArray(req.body.images) ? req.body.images.length : 0;
  const totalImagesCount = imagesFilesCount || bodyImagesCount;

  if (totalImagesCount > 5) {
    errors.push("Maximum 5 product images allowed.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};

/**
 * Validate Product Update Request
 */
export const validateUpdateProduct = (req, res, next) => {
  const errors = [];
  const { title, description, category, price, discountPrice, stock } = req.body;

  // Validate title if provided
  if (title !== undefined && (!title || typeof title !== "string" || !title.trim())) {
    errors.push("Product title cannot be empty.");
  }

  // Validate description if provided
  if (description !== undefined && (!description || typeof description !== "string" || !description.trim())) {
    errors.push("Product description cannot be empty.");
  }

  // Validate category if provided
  if (category !== undefined) {
    if (!category || !category.toString().trim()) {
      errors.push("Product category cannot be empty.");
    } else if (!mongoose.Types.ObjectId.isValid(category)) {
      errors.push("Invalid category ID format.");
    }
  }

  // Validate price if provided
  let numPrice;
  if (price !== undefined) {
    numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.push("Product price must be greater than 0.");
    }
  }

  // Validate stock if provided
  if (stock !== undefined) {
    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      errors.push("Stock quantity cannot be negative.");
    }
  }

  // Validate discountPrice if provided
  if (discountPrice !== undefined) {
    const numDiscount = Number(discountPrice);
    if (isNaN(numDiscount) || numDiscount < 0) {
      errors.push("Discount price cannot be negative.");
    } else if (numPrice !== undefined && numDiscount > numPrice) {
      errors.push("Discount price cannot exceed product price.");
    }
  }

  // Validate maximum 5 product images if uploaded
  const imagesFilesCount = req.files?.images ? req.files.images.length : 0;
  const bodyImagesCount = Array.isArray(req.body.images) ? req.body.images.length : 0;
  const totalImagesCount = imagesFilesCount || bodyImagesCount;

  if (totalImagesCount > 5) {
    errors.push("Maximum 5 product images allowed.");
  }

  if (errors.length > 0) {
    return sendError(res, 400, errors[0], errors);
  }

  next();
};
