import api from "../api/auth";

/**
 * Fetch products list with filters, search, category, and pagination
 */
export const getProducts = async (params = {}) => {
  const defaultParams = { includeInactive: true, limit: 10, ...params };
  const response = await api.get("/products", { params: defaultParams });
  return response.data;
};

/**
 * Fetch single product details by ID
 */
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product using FormData
 */
export const createProduct = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Update an existing product using FormData
 */
export const updateProduct = async (id, formData) => {
  const response = await api.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Delete product by ID
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
