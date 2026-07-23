import api from "../../../api/auth";

/**
 * Get all addresses for logged in user
 */
export const getAddresses = async () => {
  const response = await api.get("/address");
  return response.data;
};

/**
 * Get single address by ID
 * @param {string} id - Address ID
 */
export const getAddress = async (id) => {
  const response = await api.get(`/address/${id}`);
  return response.data;
};

/**
 * Create a new address
 * @param {Object} data - Address data
 */
export const createAddress = async (data) => {
  const response = await api.post("/address", data);
  return response.data;
};

/**
 * Update existing address by ID
 * @param {string} id - Address ID
 * @param {Object} data - Updated address fields
 */
export const updateAddress = async (id, data) => {
  const response = await api.patch(`/address/${id}`, data);
  return response.data;
};

/**
 * Delete an address by ID
 * @param {string} id - Address ID
 */
export const deleteAddress = async (id) => {
  const response = await api.delete(`/address/${id}`);
  return response.data;
};

/**
 * Set an address as default
 * @param {string} id - Address ID
 */
export const setDefaultAddress = async (id) => {
  const response = await api.patch(`/address/${id}/default`);
  return response.data;
};

export default {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
