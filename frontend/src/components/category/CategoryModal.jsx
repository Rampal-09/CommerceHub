import React, { useState, useEffect } from "react";
import { X, FolderPlus, Edit3 } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ImageUpload from "./ImageUpload";

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  category = null, // null for Add, category object for Edit
  submitting = false,
}) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setIsActive(category.isActive !== undefined ? category.isActive : true);
      setImageFile(null);
    } else {
      setName("");
      setIsActive(true);
      setImageFile(null);
    }
    setErrors({});
  }, [category, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Category name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Category name must be at least 2 characters.";
    }

    if (!isEditing && !imageFile) {
      newErrors.image = "Category image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("isActive", isActive);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  const handleImageSelect = (file, fileErr) => {
    setImageFile(file);
    if (fileErr) {
      setErrors((prev) => ({ ...prev, image: fileErr }));
    } else {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const getCurrentImageUrl = () => {
    if (!category) return null;
    return category.image?.url || (typeof category.image === "string" ? category.image : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isEditing
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-indigo-50 text-indigo-600 border border-indigo-200"
              }`}
            >
              {isEditing ? (
                <Edit3 className="w-5 h-5" />
              ) : (
                <FolderPlus className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Update category details and status"
                  : "Fill in details to create a new category"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Category Name */}
          <Input
            label="Category Name"
            placeholder="e.g. Consumer Electronics"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            error={errors.name}
            required
            disabled={submitting}
          />

          {/* Image Upload & Preview */}
          <ImageUpload
            label="Category Image"
            required={!isEditing}
            currentImageUrl={getCurrentImageUrl()}
            onFileSelect={handleImageSelect}
            error={errors.image}
          />

          {/* Active Status Toggle (Shown for both create and edit) */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category Status
              </span>
              <span className="text-xs text-slate-500">
                {isActive
                  ? "Category will be visible to buyers"
                  : "Category will be hidden from storefront"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={submitting}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              loadingText={isEditing ? "Updating..." : "Creating..."}
            >
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
