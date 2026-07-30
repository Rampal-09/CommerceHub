import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import HeroSlider from "../../components/customer/HeroSlider";
import ProductCard from "../../components/customer/ProductCard";
import ProductGridSkeleton from "../../components/customer/ProductGridSkeleton";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

export const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("-createdAt");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

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

  // Fetch Customer Products
  const fetchCustomerProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
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

      if (appliedMinPrice !== "") {
        params.minPrice = appliedMinPrice;
      }

      if (appliedMaxPrice !== "") {
        params.maxPrice = appliedMaxPrice;
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
      console.error("Fetch products error:", err);
      toast.error("Failed to load products list.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    limit,
    searchTerm,
    selectedCategory,
    isFeaturedFilter,
    appliedMinPrice,
    appliedMaxPrice,
    sortOption,
  ]);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  useEffect(() => {
    fetchCustomerProducts();
  }, [fetchCustomerProducts]);

  // Apply Price Filter
  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(1);
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setIsFeaturedFilter(false);
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setSortOption("-createdAt");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Interactive 5-Second 3D Hero Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <HeroSlider />
      </div>

      <div id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Search & Top Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products by title or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Featured Toggle & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => {
                setIsFeaturedFilter(!isFeaturedFilter);
                setCurrentPage(1);
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
                  setCurrentPage(1);
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

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filter Catalog
                </h3>
                {(selectedCategory ||
                  isFeaturedFilter ||
                  appliedMinPrice ||
                  appliedMaxPrice ||
                  searchTerm) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-red-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
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

              {/* Price Range Filter Form */}
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
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Apply Price Filter
                </button>
              </form>
            </div>
          </div>

          {/* Products Grid & Pagination */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="We couldn't find any products matching your selected search or filter criteria."
                actionText="Reset Filters"
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
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalProducts}
              limit={limit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
