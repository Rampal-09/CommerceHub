import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Layers,
  Tag,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../../components/customer/ProductCard";
import ProductGridSkeleton from "../../components/customer/ProductGridSkeleton";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

export const CustomerCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract filter parameters from URL query
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const featuredParam = searchParams.get("featured") === "true";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "-createdAt";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Local Filter UI State synced with URL
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(featuredParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [sortOption, setSortOption] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // Sync internal state when URL searchParams change
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setIsFeaturedFilter(searchParams.get("featured") === "true");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSortOption(searchParams.get("sort") || "-createdAt");
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Helper to update URL search params
  const updateUrlParams = (newParamsObj) => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(newParamsObj).forEach((key) => {
      const val = newParamsObj[key];
      if (val !== undefined && val !== null && val !== "" && val !== false) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  // Fetch Category choices
  const fetchCategoryList = useCallback(async () => {
    try {
      const res = await getCategories({ includeInactive: false });
      const catList = res.data || res.categories || res;
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // Fetch Customer Products matching current URL params
  const fetchCatalogProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortOption,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (isFeaturedFilter) {
        params.isFeatured = true;
      }

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      const res = await getProducts(params);
      const list = res.products || res.data || [];

      setProducts(list);
      setPagination({
        currentPage: res.currentPage || 1,
        totalPages: res.totalPages || 1,
        totalProducts: res.totalProducts || list.length,
      });
    } catch (err) {
      console.error("Fetch catalog products error:", err);
      toast.error("Failed to load catalog products.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, isFeaturedFilter, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  useEffect(() => {
    fetchCatalogProducts();
  }, [fetchCatalogProducts]);

  // Apply Price Filter Form Submit
  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    updateUrlParams({
      minPrice,
      maxPrice,
      page: 1,
    });
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Selected Category Object
  const currentCategoryObj = categories.find((c) => c._id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link to="/" className="hover:text-indigo-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700">Catalog</span>
              {currentCategoryObj && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-indigo-600 font-bold">{currentCategoryObj.name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentCategoryObj ? currentCategoryObj.name : "Product Catalog"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {pagination.totalProducts} items available matching your criteria
            </p>
          </div>

          {/* Quick Active Filter Badges */}
          {(selectedCategory || searchTerm || isFeaturedFilter || minPrice || maxPrice) && (
            <div className="flex items-center gap-2 flex-wrap">
              {currentCategoryObj && (
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-indigo-200/80">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Category: {currentCategoryObj.name}</span>
                  <button
                    onClick={() => updateUrlParams({ category: "", page: 1 })}
                    className="hover:bg-indigo-100 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>"{searchTerm}"</span>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      updateUrlParams({ search: "", page: 1 });
                    }}
                    className="hover:bg-slate-200 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isFeaturedFilter && (
                <span className="px-3 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Featured Only</span>
                  <button
                    onClick={() => updateUrlParams({ featured: false, page: 1 })}
                    className="hover:bg-amber-100 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    ${minPrice || "0"} - ${maxPrice || "∞"}
                  </span>
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      updateUrlParams({ minPrice: "", maxPrice: "", page: 1 });
                    }}
                    className="hover:bg-emerald-100 p-0.5 rounded-md cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 font-extrabold hover:underline flex items-center gap-1 ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Top Control Bar: Search & Sorting */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUrlParams({ search: searchTerm.trim(), page: 1 });
            }}
            className="relative w-full md:w-96"
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
            />
          </form>

          {/* Featured Toggle & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => {
                const nextFeatured = !isFeaturedFilter;
                setIsFeaturedFilter(nextFeatured);
                updateUrlParams({ featured: nextFeatured, page: 1 });
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isFeaturedFilter
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Only</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  updateUrlParams({ sort: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="-createdAt">Newest Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout: Filter Drawer Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filter Options
                </h3>
                {(selectedCategory ||
                  isFeaturedFilter ||
                  minPrice ||
                  maxPrice ||
                  searchTerm) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-red-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset All
                  </button>
                )}
              </div>

              {/* Category Filter List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Categories
                </label>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      updateUrlParams({ category: "", page: 1 });
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === ""
                        ? "bg-brand-gradient text-white font-bold shadow-brand-glow"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        updateUrlParams({ category: cat._id, page: 1 });
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat._id
                          ? "bg-brand-gradient text-white font-bold shadow-brand-glow"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Form */}
              <form onSubmit={handleApplyPriceFilter} className="space-y-3 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Range ($)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-400 text-xs font-bold">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-gradient hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-brand-glow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Apply Price Filter
                </button>
              </form>
            </div>
          </div>

          {/* Products Grid Section */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <ProductGridSkeleton count={9} />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products match your search"
                description="Try relaxing your category or price range filters to discover available items."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prod, index) => (
                  <ProductCard key={prod._id || prod.id} product={prod} index={index} />
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalProducts}
                limit={12}
                onPageChange={(page) => updateUrlParams({ page })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCatalog;
