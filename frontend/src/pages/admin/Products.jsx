import React, { useState } from "react";
import { Plus, Package, RefreshCw, Filter, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import ProductTable from "../../components/product/ProductTable";
import DeleteProductModal from "../../components/product/DeleteProductModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";

export const Products = () => {
  const navigate = useNavigate();

  const {
    products,
    categories,
    loading,
    submitting,
    pagination,
    currentPage,
    searchTerm,
    selectedCategory,
    sortOption,
    setSearchTerm,
    setSelectedCategory,
    setSortOption,
    handlePageChange,
    refreshProducts,
    deleteProduct,
  } = useProducts();

  // Modal State
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Handlers
  const handleOpenDeleteModal = (product) => {
    setDeletingProduct(product);
  };

  const handleCloseDeleteModal = () => {
    setDeletingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const result = await deleteProduct(deletingProduct._id);
    if (result.success) {
      handleCloseDeleteModal();
    }
  };

  const handleEditProduct = (product) => {
    // Navigate or trigger edit action
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handleAddProduct = () => {
    navigate("/admin/products/new");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Link
                to="/dashboard"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="text-indigo-600">Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="w-7 h-7 text-indigo-600" />
              Products
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshProducts}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all shadow-2xs hover:shadow-xs disabled:opacity-50 cursor-pointer"
              title="Refresh Product List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm("")}
              placeholder="Search by title or SKU..."
              className="w-full sm:w-72"
            />

            {/* Category Filter Dropdown */}
            <div className="relative w-full sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-4 h-4" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs transition-all appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 w-full md:w-auto justify-end">
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="title">Title: A to Z</option>
              <option value="-title">Title: Z to A</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <ProductTable
          products={products}
          loading={loading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onEdit={handleEditProduct}
          onDelete={handleOpenDeleteModal}
          onAddProduct={handleAddProduct}
        />

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalProducts}
          limit={10}
          onPageChange={handlePageChange}
        />

        {/* Delete Product Confirmation Modal */}
        <DeleteProductModal
          isOpen={Boolean(deletingProduct)}
          productTitle={deletingProduct?.title}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleting={submitting}
        />
      </div>
    </div>
  );
};

export default Products;
