import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Sliders, CheckCircle, RefreshCw } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";
import { getCategories } from "../../services/categoryService";

export const ProductForm = ({
  initialData = null, // null for create, product object for edit
  onSubmit,
  submitting = false,
  isEditing = false,
}) => {
  // Category choices state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Media File States
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Complex Field States
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);

  // Validation Error State
  const [errors, setErrors] = useState({});

  // Helper: auto-generate slug from title
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCatOptions = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories({ includeInactive: true });
        const catList = res.data || res.categories || res;
        setCategories(Array.isArray(catList) ? catList : []);
      } catch (err) {
        console.error("Failed to load category list:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCatOptions();
  }, []);

  // Populate data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setAutoSlug(false);
      setDescription(initialData.description || "");
      setShortDescription(initialData.shortDescription || "");
      setCategory(initialData.category?._id || initialData.category || "");
      setBrand(initialData.brand || "");
      setPrice(initialData.price !== undefined ? String(initialData.price) : "");
      setDiscountPrice(initialData.discountPrice !== undefined ? String(initialData.discountPrice) : "");
      setStock(initialData.stock !== undefined ? String(initialData.stock) : "0");
      setSku(initialData.sku || "");
      setIsFeatured(Boolean(initialData.isFeatured));
      setIsActive(initialData.isActive !== undefined ? Boolean(initialData.isActive) : true);

      if (initialData.tags && Array.isArray(initialData.tags)) {
        setTags(initialData.tags);
      }
      if (initialData.specifications && Array.isArray(initialData.specifications) && initialData.specifications.length > 0) {
        setSpecifications(initialData.specifications);
      }
    }
  }, [initialData]);

  // Title change handler with auto-slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));

    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Tag Add & Remove Handlers
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Specifications Builders Handlers
  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpecRow = (index) => {
    if (specifications.length === 1) {
      setSpecifications([{ key: "", value: "" }]);
    } else {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  // Client Validation
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Product title is required.";
    }

    if (!slug.trim()) {
      newErrors.slug = "Product slug is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Product description is required.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    }

    const numPrice = Number(price);
    if (price === "" || isNaN(numPrice)) {
      newErrors.price = "Product price is required.";
    } else if (numPrice <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (discountPrice !== "" && discountPrice !== null) {
      const numDiscount = Number(discountPrice);
      if (isNaN(numDiscount) || numDiscount < 0) {
        newErrors.discountPrice = "Discount price cannot be negative.";
      } else if (!isNaN(numPrice) && numDiscount > numPrice) {
        newErrors.discountPrice = "Discount price cannot exceed original price.";
      }
    }

    const numStock = Number(stock);
    if (stock === "" || isNaN(numStock) || numStock < 0) {
      newErrors.stock = "Stock quantity cannot be negative.";
    }

    if (!isEditing && !thumbnailFile) {
      newErrors.thumbnail = "Product thumbnail image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler (Build FormData)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("description", description.trim());
    if (shortDescription.trim()) formData.append("shortDescription", shortDescription.trim());
    formData.append("category", category);
    if (brand.trim()) formData.append("brand", brand.trim());
    formData.append("price", price);
    if (discountPrice !== "") formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    if (sku.trim()) formData.append("sku", sku.trim());
    formData.append("isFeatured", isFeatured);
    formData.append("isActive", isActive);

    // Filter non-empty specifications
    const validSpecs = specifications.filter(
      (s) => s.key.trim() || s.value.trim()
    );
    if (validSpecs.length > 0) {
      formData.append("specifications", JSON.stringify(validSpecs));
    }

    // Filter tags
    if (tags.length > 0) {
      formData.append("tags", JSON.stringify(tags));
    }

    // Thumbnail file
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    // Gallery files
    if (galleryFiles && galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    onSubmit(formData);
  };

  const currentThumbnailUrl =
    initialData?.thumbnail?.url ||
    (typeof initialData?.thumbnail === "string" ? initialData.thumbnail : null);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Basic Information Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📦</span> Basic Product Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <Input
            label="Product Title"
            placeholder="e.g. Wireless Noise-Canceling Headphones"
            value={title}
            onChange={handleTitleChange}
            error={errors.title}
            required
            disabled={submitting}
          />

          {/* Slug */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Product Slug <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                {autoSlug ? "Custom Edit" : "Auto Generate"}
              </button>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
                if (errors.slug) setErrors((prev) => ({ ...prev, slug: null }));
              }}
              placeholder="e.g. wireless-noise-canceling-headphones"
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.slug
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-300 focus:ring-indigo-500"
              }`}
            />
            {errors.slug && (
              <p className="text-xs text-red-500 font-medium">{errors.slug}</p>
            )}
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category Dropdown */}
          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
              disabled={submitting || loadingCategories}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all appearance-none cursor-pointer ${
                errors.category
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-300 focus:ring-indigo-500"
              }`}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Brand */}
          <Input
            label="Brand / Manufacturer"
            placeholder="e.g. Sony, Apple, Nike"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Short Description & Full Description */}
        <div className="space-y-4">
          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Short Description
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary highlights (1-2 sentences)..."
              disabled={submitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
              placeholder="Detailed product overview, features, materials, warranty..."
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.description
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-300 focus:ring-indigo-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Pricing & Stock Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🏷️</span> Pricing, Inventory & Identifiers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Price */}
          <Input
            label="Original Price ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
            }}
            error={errors.price}
            required
            disabled={submitting}
          />

          {/* Discount Price */}
          <Input
            label="Discount Price ($)"
            type="number"
            step="0.01"
            placeholder="Optional sale price"
            value={discountPrice}
            onChange={(e) => {
              setDiscountPrice(e.target.value);
              if (errors.discountPrice) setErrors((prev) => ({ ...prev, discountPrice: null }));
            }}
            error={errors.discountPrice}
            disabled={submitting}
          />

          {/* Stock */}
          <Input
            label="Stock Quantity"
            type="number"
            min="0"
            placeholder="0"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              if (errors.stock) setErrors((prev) => ({ ...prev, stock: null }));
            }}
            error={errors.stock}
            required
            disabled={submitting}
          />

          {/* SKU */}
          <Input
            label="SKU Code"
            placeholder="e.g. WH-1000XM5-BLK"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      {/* 3. Media Upload Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🖼️</span> Product Media & Images
        </h3>

        <div className="space-y-6">
          {/* Main Thumbnail Upload */}
          <ImageUpload
            label="Main Thumbnail Image"
            required={!isEditing}
            currentImageUrl={currentThumbnailUrl}
            onFileSelect={(file, err) => {
              setThumbnailFile(file);
              if (err) setErrors((prev) => ({ ...prev, thumbnail: err }));
              else setErrors((prev) => ({ ...prev, thumbnail: null }));
            }}
            error={errors.thumbnail}
          />

          {/* Gallery Images Upload */}
          <GalleryUpload
            existingImages={initialData?.images || []}
            onFilesSelect={(files) => setGalleryFiles(files)}
            error={errors.images}
            maxImages={5}
          />
        </div>
      </div>

      {/* 4. Specifications & Tags Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>⚙️</span> Specifications & Tags
        </h3>

        {/* Specifications Key-Value Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Technical Specifications
            </label>
            <button
              type="button"
              onClick={handleAddSpecRow}
              disabled={submitting}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Specification
            </button>
          </div>

          <div className="space-y-2.5">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Key (e.g. Connectivity)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                  disabled={submitting}
                  className="w-1/2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Bluetooth 5.2)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  disabled={submitting}
                  className="w-1/2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  disabled={submitting}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove Specification Row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Entry */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Product Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag(e);
                }
              }}
              placeholder="Type tag name and press Enter..."
              disabled={submitting}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={submitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Add Tag
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100"
                >
                  <Tag className="w-3 h-3 text-indigo-500" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Status & Visibility Toggles */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>✨</span> Visibility & Display Options
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Active Product
              </span>
              <span className="text-xs text-slate-500">
                Make product available in storefront catalog
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

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Featured Product
              </span>
              <span className="text-xs text-slate-500">
                Highlight on homepage featured sections
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={submitting}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          loadingText={isEditing ? "Updating Product..." : "Saving Product..."}
        >
          {isEditing ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
