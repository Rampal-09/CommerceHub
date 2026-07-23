import api from "../../../api/auth";

/**
 * Get logged-in user's wishlist
 */
export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

/**
 * Add a product to wishlist
 * @param {string} productId - ID of product
 */
export const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", { productId });
  return response.data;
};

/**
 * Remove a product from wishlist
 * @param {string} productId - ID of product
 */
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

/**
 * Clear all products from wishlist
 */
export const clearWishlist = async () => {
  const response = await api.delete("/wishlist");
  return response.data;
};

/**
 * Check if a product is in the wishlist
 * @param {string} productId - ID of product
 */
export const checkIsWishlisted = async (productId) => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkIsWishlisted,
};
