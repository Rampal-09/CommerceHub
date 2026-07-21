import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getCategories,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories({ includeInactive: true });
      const data = res.data || res.categories || res;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load categories.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Client-side search filtering
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const query = searchTerm.toLowerCase().trim();
    return categories.filter((cat) =>
      cat.name?.toLowerCase().includes(query) ||
      cat.slug?.toLowerCase().includes(query)
    );
  }, [categories, searchTerm]);

  // Create Category handler
  const handleCreateCategory = async (formData) => {
    try {
      setSubmitting(true);
      const res = await createCategoryApi(formData);
      toast.success(res.message || "Category created successfully.");
      await fetchCategories();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Create category error:", err);
      const msg =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  // Update Category handler
  const handleUpdateCategory = async (id, formData) => {
    try {
      setSubmitting(true);
      const res = await updateCategoryApi(id, formData);
      toast.success(res.message || "Category updated successfully.");
      await fetchCategories();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Update category error:", err);
      const msg =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category handler
  const handleDeleteCategory = async (id) => {
    try {
      setSubmitting(true);
      const res = await deleteCategoryApi(id);
      toast.success(res.message || "Category deleted successfully.");
      await fetchCategories();
      return { success: true };
    } catch (err) {
      console.error("Delete category error:", err);
      const msg =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    categories,
    filteredCategories,
    loading,
    submitting,
    error,
    searchTerm,
    setSearchTerm,
    refreshCategories: fetchCategories,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
  };
};

export default useCategories;
