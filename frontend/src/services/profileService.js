import api from "../api/auth";

/**
 * Get logged-in user profile
 */
export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

/**
 * Update user profile information (name, phone, gender, dateOfBirth)
 * @param {Object} payload
 */
export const updateProfile = async (payload) => {
  const response = await api.patch("/users/profile", payload);
  return response.data;
};

/**
 * Upload or update profile avatar image
 * @param {FormData} formData - FormData containing 'avatar' file
 */
export const uploadAvatar = async (formData) => {
  const response = await api.patch("/users/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Remove user profile avatar image
 */
export const removeAvatar = async () => {
  const response = await api.delete("/users/profile/avatar");
  return response.data;
};

/**
 * Change account password
 * @param {Object} payload - { currentPassword, newPassword, confirmPassword }
 */
export const changePassword = async (payload) => {
  const response = await api.patch("/users/change-password", payload);
  return response.data;
};

/**
 * Get paginated user order history
 * @param {number} [page=1]
 * @param {number} [limit=10]
 */
export const getOrders = async (page = 1, limit = 10) => {
  const response = await api.get("/users/orders", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get single order details by ID
 * @param {string} id - Order ID
 */
export const getOrderById = async (id) => {
  const response = await api.get(`/users/orders/${id}`);
  return response.data;
};

/**
 * Get user's wishlist
 */
export const getWishlist = async () => {
  const response = await api.get("/users/wishlist");
  return response.data;
};

/**
 * Get user account dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await api.get("/users/dashboard");
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  getOrders,
  getOrderById,
  getWishlist,
  getDashboardStats,
};
