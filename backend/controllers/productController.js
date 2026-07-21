import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body, req.files);
    return sendResponse(res, 201, "Product created successfully.", product);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get all products (with search, category, active status, featured, price range, sorting, pagination)
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { products, currentPage, totalPages, totalProducts } = await getProductsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
      currentPage,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    return sendResponse(res, 200, "Product details retrieved successfully.", product);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PATCH /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductService(req.params.id, req.body, req.files);
    return sendResponse(res, 200, "Product updated successfully.", updatedProduct);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    return sendResponse(res, 200, "Product deleted successfully.");
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};
