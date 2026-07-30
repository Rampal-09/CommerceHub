import Wishlist from "../modals/wishlistSchema.js";
import Product from "../modals/productSchema.js";

const POPULATE_PRODUCT_FIELDS = "title slug thumbnail price discountPrice stock isActive category ratings";

/**
 * Helper to populate products in Wishlist
 */
const populateWishlistProducts = async (wishlist) => {
  await wishlist.populate({
    path: "products.product",
    select: POPULATE_PRODUCT_FIELDS,
  });

  // Filter out any deleted/null products
  if (wishlist.products && Array.isArray(wishlist.products)) {
    wishlist.products = wishlist.products.filter((item) => item.product !== null);
  }

  return wishlist;
};

/**
 * Add a product to the user's wishlist
 * @param {string} userId
 * @param {string} productId
 */
export const addToWishlistService = async (userId, productId) => {
  // 1. Verify Product Existence & Active Status
  const product = await Product.findById(productId);
  if (!product) {
    throw { statusCode: 404, message: "Product not found." };
  }

  if (product.isActive === false) {
    throw { statusCode: 400, message: "Product is inactive and cannot be added to wishlist." };
  }

  // 2. Find or Auto-Create Wishlist for User
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      products: [],
    });
  }

  // 3. Check for Duplicate Product
  const isDuplicate = wishlist.products.some(
    (item) => item.product.toString() === productId.toString()
  );

  if (isDuplicate) {
    throw { statusCode: 409, message: "Product already in wishlist." };
  }

  // 4. Add Product to Wishlist
  wishlist.products.push({
    product: productId,
    addedAt: new Date(),
  });

  await wishlist.save();
  await populateWishlistProducts(wishlist);

  return wishlist;
};

/**
 * Get user's wishlist
 * @param {string} userId
 */
export const getWishlistService = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return {
      user: userId,
      products: [],
    };
  }

  await populateWishlistProducts(wishlist);
  return wishlist;
};

/**
 * Remove a single product from wishlist
 * @param {string} userId
 * @param {string} productId
 */
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw { statusCode: 404, message: "Wishlist not found." };
  }

  const initialLength = wishlist.products.length;
  wishlist.products = wishlist.products.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  if (wishlist.products.length === initialLength) {
    throw { statusCode: 404, message: "Product not found in wishlist." };
  }

  await wishlist.save();
  await populateWishlistProducts(wishlist);

  return wishlist;
};

/**
 * Clear all items from user's wishlist
 * @param {string} userId
 */
export const clearWishlistService = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw { statusCode: 404, message: "Wishlist not found." };
  }

  wishlist.products = [];
  await wishlist.save();

  return wishlist;
};

/**
 * Check if a product is in the user's wishlist
 * @param {string} userId
 * @param {string} productId
 */
export const isWishlistedService = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw { statusCode: 404, message: "Product not found." };
  }

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    return { isWishlisted: false };
  }

  const isWishlisted = wishlist.products.some(
    (item) => item.product.toString() === productId.toString()
  );

  return { isWishlisted };
};

export default {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
  clearWishlistService,
  isWishlistedService,
};
