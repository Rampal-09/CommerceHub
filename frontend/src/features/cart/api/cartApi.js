import api from "../../../api/auth";

/**
 * Fetch the logged-in user's cart
 */
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

/**
 * Add a product to the cart
 * @param {string} productId - ID of product
 * @param {number} [quantity=1] - Item quantity
 */
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/cart", { productId, quantity });
  return response.data;
};

/**
 * Update quantity of a specific item in the cart
 * @param {string} productId - ID of product
 * @param {number} quantity - New quantity
 */
export const updateQuantity = async (productId, quantity) => {
  const response = await api.patch(`/cart/items/${productId}`, { quantity });
  return response.data;
};

/**
 * Remove a product from the cart
 * @param {string} productId - ID of product
 */
export const removeCartItem = async (productId) => {
  const response = await api.delete(`/cart/items/${productId}`);
  return response.data;
};

/**
 * Clear all items from the cart
 */
export const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateQuantity,
  removeCartItem,
  clearCart,
};
