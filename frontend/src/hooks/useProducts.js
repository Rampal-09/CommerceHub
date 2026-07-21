import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getProducts as getProductsApi,
  deleteProduct as deleteProductApi,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // Fetch Category options for filter dropdown
  const fetchCategoryOptions = useCallback(async () => {
    try {
      const res = await getCategories({ includeInactive: true });
      const data = res.data || res.categories || res;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load category dropdown options:", err);
    }
  }, []);

  // Fetch Products with filters & pagination
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit,
        includeInactive: true,
        sort: sortOption,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const res = await getProductsApi(params);
      const productList = res.products || res.data || [];

      setProducts(productList);
      setPagination({
        currentPage: res.currentPage || 1,
        totalPages: res.totalPages || 1,
        totalProducts: res.totalProducts || productList.length,
      });
    } catch (err) {
      console.error("Fetch products error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load products.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    fetchCategoryOptions();
  }, [fetchCategoryOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Search input handler with page reset
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Category selection handler with page reset
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  // Sort option handler
  const handleSortChange = (sort) => {
    setSortOption(sort);
    setCurrentPage(1);
  };

  // Delete product handler
  const handleDeleteProduct = async (id) => {
    try {
      setSubmitting(true);
      const res = await deleteProductApi(id);
      toast.success(res.message || "Product deleted successfully.");
      await fetchProducts();
      return { success: true };
    } catch (err) {
      console.error("Delete product error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to delete product.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    products,
    categories,
    loading,
    submitting,
    error,
    pagination,
    currentPage,
    searchTerm,
    selectedCategory,
    sortOption,
    setSearchTerm: handleSearchChange,
    setSelectedCategory: handleCategoryChange,
    setSortOption: handleSortChange,
    handlePageChange,
    refreshProducts: fetchProducts,
    deleteProduct: handleDeleteProduct,
  };
};

export default useProducts;
