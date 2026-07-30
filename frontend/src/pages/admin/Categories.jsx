import React, { useState } from "react";
import { Plus, Layers, RefreshCw, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import useCategories from "../../hooks/useCategories";
import CategoryTable from "../../components/category/CategoryTable";
import CategoryModal from "../../components/category/CategoryModal";
import DeleteCategoryModal from "../../components/category/DeleteCategoryModal";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";

export const Categories = () => {
  const {
    categories,
    filteredCategories,
    loading,
    submitting,
    searchTerm,
    setSearchTerm,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Handlers
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
  };

  const handleCloseEditModal = () => {
    setEditingCategory(null);
  };

  const handleOpenDeleteModal = (category) => {
    setDeletingCategory(category);
  };

  const handleCloseDeleteModal = () => {
    setDeletingCategory(null);
  };

  // Submit Add / Edit
  const handleCategorySubmit = async (formData) => {
    if (editingCategory) {
      const result = await updateCategory(editingCategory._id, formData);
      if (result.success) {
        handleCloseEditModal();
      }
    } else {
      const result = await createCategory(formData);
      if (result.success) {
        handleCloseAddModal();
      }
    }
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const result = await deleteCategory(deletingCategory._id);
    if (result.success) {
      handleCloseDeleteModal();
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.length - activeCount;

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
              <Layers className="w-7 h-7 text-indigo-600" />
              Categories
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshCategories}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all shadow-2xs hover:shadow-xs disabled:opacity-50 cursor-pointer"
              title="Refresh Categories"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenAddModal}
            >
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Categories
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {loading ? "—" : categories.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📁
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Categories
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {loading ? "—" : activeCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✅
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inactive Categories
              </p>
              <h3 className="text-2xl font-black text-slate-500 mt-1">
                {loading ? "—" : inactiveCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
              ⏸️
            </div>
          </div>
        </div>

        {/* Search & Filter Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search categories by name..."
          />

          <div className="text-xs font-medium text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredCategories.length}
            </span>{" "}
            of <span className="font-bold text-slate-900">{categories.length}</span> categories
          </div>
        </div>

        {/* Categories Table View */}
        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          searchTerm={searchTerm}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onAddCategory={handleOpenAddModal}
        />

        {/* Add Category Modal */}
        <CategoryModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCategorySubmit}
          submitting={submitting}
        />

        {/* Edit Category Modal */}
        <CategoryModal
          isOpen={Boolean(editingCategory)}
          category={editingCategory}
          onClose={handleCloseEditModal}
          onSubmit={handleCategorySubmit}
          submitting={submitting}
        />

        {/* Delete Category Modal */}
        <DeleteCategoryModal
          isOpen={Boolean(deletingCategory)}
          categoryName={deletingCategory?.name}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleting={submitting}
        />
      </div>
    </div>
  );
};

export default Categories;
