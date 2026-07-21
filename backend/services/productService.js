import mongoose from "mongoose";
import Product from "../modals/productSchema.js";
import Category from "../modals/categorySchema.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteSingleImage,
  deleteMultipleImages,
  rollbackUploadedFiles,
} from "./imageUploadService.js";

/**
 * Generate a URL-friendly unique slug from product title
 */

export const generateUniqueSlug = async (title, currentId = null) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  const filter = { slug };
  if (currentId) {
    filter._id = { $ne: currentId };
  }

  const existing = await Product.findOne(filter).select("_id").lean();
  if (existing) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  return slug;
};

/**
 * Safely parse FormData array or JSON string fields
 */
export const parseArrayField = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

/**
 * Create a new Product
 */
export const createProductService = async (body, files = {}) => {
  const newlyUploadedPublicIds = [];

  try {
    const {
      title,
      description,
      shortDescription,
      category,
      brand,
      price,
      discountPrice,
      stock,
      sku,
      isFeatured,
      isActive,
      tags,
      specifications,
    } = body;

    // Verify Category exists
    const categoryExists = await Category.findById(category).select("_id").lean();
    if (!categoryExists) {
      throw { statusCode: 404, message: "Specified category does not exist." };
    }

    // Generate Slug
    const slug = await generateUniqueSlug(title);

    // Check SKU uniqueness
    if (sku && sku.trim()) {
      const existingSku = await Product.findOne({ sku: sku.trim() }).select("_id").lean();
      if (existingSku) {
        throw { statusCode: 409, message: "Product with this SKU already exists." };
      }
    }

    // 1. Upload Thumbnail Image
    let thumbnailObj = { url: "", public_id: "" };
    const thumbnailFile = files?.thumbnail?.[0];
    if (thumbnailFile) {
      const uploadedThumbnail = await uploadSingleImage(thumbnailFile.buffer, "products");
      thumbnailObj = {
        url: uploadedThumbnail.url,
        public_id: uploadedThumbnail.public_id,
      };
      newlyUploadedPublicIds.push(uploadedThumbnail.public_id);
    }

    // 2. Upload Gallery Images (max 5)
    let imagesList = [];
    if (files?.images && files.images.length > 0) {
      const { uploadedImages, publicIds } = await uploadMultipleImages(files.images, "products", 5);
      imagesList = uploadedImages;
      newlyUploadedPublicIds.push(...publicIds);
    }

    const productData = {
      title: title.trim(),
      slug,
      description: description.trim(),
      shortDescription: shortDescription ? shortDescription.trim() : "",
      category,
      brand: brand ? brand.trim() : "",
      price: Number(price),
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : 0,
      stock: stock !== undefined ? Number(stock) : 0,
      sku: sku && sku.trim() ? sku.trim() : undefined,
      thumbnail: thumbnailObj,
      images: imagesList,
      isFeatured: isFeatured !== undefined ? String(isFeatured) === "true" || isFeatured === true : false,
      isActive: isActive !== undefined ? String(isActive) === "true" || isActive === true : true,
      tags: parseArrayField(tags),
      specifications: parseArrayField(specifications),
    };

    const product = await Product.create(productData);
    await product.populate("category", "name slug");

    return product;
  } catch (error) {
    await rollbackUploadedFiles(newlyUploadedPublicIds);
    throw error;
  }
};

/**
 * Get Products list with query parameters
 */
export const getProductsService = async (queryParams = {}) => {
  const {
    category,
    search,
    title,
    sku,
    isFeatured,
    isActive,
    includeInactive,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = queryParams;

  const queryFilter = {};

  // 1. Search by title and SKU (case-insensitive, partial matching)
  const searchQuery = search || title || sku;
  if (searchQuery && searchQuery.trim()) {
    const sanitizedTerm = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitizedTerm, "i");

    if (title && !search) {
      queryFilter.title = regex;
    } else if (sku && !search) {
      queryFilter.sku = regex;
    } else {
      queryFilter.$or = [{ title: regex }, { sku: regex }];
    }
  }

  // 2. Category Filter
  if (category && mongoose.Types.ObjectId.isValid(category)) {
    queryFilter.category = category;
  }

  // 3. Active Status Filter
  if (isActive !== undefined) {
    queryFilter.isActive = String(isActive) === "true" || isActive === true;
  } else if (includeInactive !== "true") {
    queryFilter.isActive = true;
  }

  // 4. Featured Filter
  if (isFeatured !== undefined) {
    queryFilter.isFeatured = String(isFeatured) === "true" || isFeatured === true;
  }

  // 5. Price Range Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    queryFilter.price = {};
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      queryFilter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      queryFilter.price.$lte = Number(maxPrice);
    }
  }

  // 6. Pagination & Sorting
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (currentPage - 1) * limitNum;
  const sortOption = sort.split(",").join(" ");

  const totalProducts = await Product.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalProducts / limitNum) || 1;

  const products = await Product.find(queryFilter)
    .populate("category", "name slug")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .lean();

  return {
    products,
    currentPage,
    totalPages,
    totalProducts,
  };
};

/**
 * Get Product by ID
 */
export const getProductByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 404, message: "Product not found." };
  }

  const product = await Product.findById(id).populate("category", "name slug").lean();
  if (!product) {
    throw { statusCode: 404, message: "Product not found." };
  }

  return product;
};

/**
 * Update Product
 */
export const updateProductService = async (id, body, files = {}) => {
  const newlyUploadedPublicIds = [];

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { statusCode: 404, message: "Product not found." };
    }

    const product = await Product.findById(id);
    if (!product) {
      throw { statusCode: 404, message: "Product not found." };
    }

    const {
      title,
      description,
      shortDescription,
      category,
      brand,
      price,
      discountPrice,
      stock,
      sku,
      isFeatured,
      isActive,
      tags,
      specifications,
    } = body;

    // Validate category if updating category
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw { statusCode: 400, message: "Invalid category ID format." };
      }
      const categoryExists = await Category.findById(category).select("_id").lean();
      if (!categoryExists) {
        throw { statusCode: 404, message: "Specified category does not exist." };
      }
      product.category = category;
    }

    // Title & Slug update
    if (title && title.trim()) {
      const trimmedTitle = title.trim();
      if (trimmedTitle.toLowerCase() !== product.title.toLowerCase()) {
        product.title = trimmedTitle;
        product.slug = await generateUniqueSlug(trimmedTitle, id);
      }
    }

    if (description !== undefined) product.description = description.trim();
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (stock !== undefined) product.stock = Number(stock);

    if (sku !== undefined) {
      const trimmedSku = sku.trim();
      if (trimmedSku && trimmedSku !== product.sku) {
        const existingSku = await Product.findOne({ sku: trimmedSku, _id: { $ne: id } }).select("_id").lean();
        if (existingSku) {
          throw { statusCode: 409, message: "Another product with this SKU already exists." };
        }
        product.sku = trimmedSku;
      }
    }

    if (isFeatured !== undefined) product.isFeatured = String(isFeatured) === "true" || isFeatured === true;
    if (isActive !== undefined) product.isActive = String(isActive) === "true" || isActive === true;
    if (tags !== undefined) product.tags = parseArrayField(tags);
    if (specifications !== undefined) product.specifications = parseArrayField(specifications);

    // Handle New Thumbnail Upload
    const newThumbnailFile = files?.thumbnail?.[0];
    if (newThumbnailFile) {
      const uploadedThumbnail = await uploadSingleImage(newThumbnailFile.buffer, "products");
      newlyUploadedPublicIds.push(uploadedThumbnail.public_id);

      if (product.thumbnail?.public_id) {
        await deleteSingleImage(product.thumbnail.public_id);
      }

      product.thumbnail = {
        url: uploadedThumbnail.url,
        public_id: uploadedThumbnail.public_id,
      };
    }

    // Handle New Gallery Images Upload
    if (files?.images && files.images.length > 0) {
      const { uploadedImages, publicIds } = await uploadMultipleImages(files.images, "products", 5);
      newlyUploadedPublicIds.push(...publicIds);

      // Delete old gallery images
      if (product.images && product.images.length > 0) {
        const oldPublicIds = product.images.map((img) => img.public_id).filter(Boolean);
        await deleteMultipleImages(oldPublicIds);
      }

      product.images = uploadedImages;
    }

    await product.save();
    await product.populate("category", "name slug");

    return product;
  } catch (error) {
    await rollbackUploadedFiles(newlyUploadedPublicIds);
    throw error;
  }
};

/**
 * Delete Product
 */
export const deleteProductService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 404, message: "Product not found." };
  }

  const product = await Product.findById(id);
  if (!product) {
    throw { statusCode: 404, message: "Product not found." };
  }

  // Delete Thumbnail from Cloudinary
  if (product.thumbnail?.public_id) {
    await deleteSingleImage(product.thumbnail.public_id);
  }

  // Delete Gallery Images from Cloudinary
  if (product.images && product.images.length > 0) {
    const galleryIds = product.images.map((img) => img.public_id).filter(Boolean);
    await deleteMultipleImages(galleryIds);
  }

  await Product.findByIdAndDelete(id);
  return true;
};
