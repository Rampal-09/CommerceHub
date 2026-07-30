import api from "../api/auth";

/**
 * Fetch all categories (by default includes inactive for admin if includeInactive: true)
 */
export const getCategories = async (params = { includeInactive: true }) => {
  const response = await api.get("/categories", { params });
  return response.data;
};

/**
 * Fetch single category by ID
 */
export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

/**
 * Create a new category using FormData
 */
export const createCategory = async (formData) => {
  const response = await api.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Update existing category using FormData
 */
export const updateCategory = async (id, formData) => {
  const response = await api.patch(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Delete category by ID
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
