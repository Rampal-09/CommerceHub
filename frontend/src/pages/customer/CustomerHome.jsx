import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Grid,
} from "lucide-react";
import toast from "react-hot-toast";
import HeroSlider from "../../components/customer/HeroSlider";
import ProductCard from "../../components/customer/ProductCard";
import ProductGridSkeleton from "../../components/customer/ProductGridSkeleton";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

export const CustomerHome = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryProductsMap, setCategoryProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Load Categories & Products grouped by Category
  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Active Categories
      const catRes = await getCategories({ includeInactive: false });
      const catList = catRes.data || catRes.categories || catRes;
      const validCategories = Array.isArray(catList) ? catList.filter((c) => c.isActive !== false) : [];
      setCategories(validCategories);

      // 2. Fetch Featured Products
      const featuredRes = await getProducts({ isFeatured: true, limit: 8, includeInactive: false });
      const featuredList = featuredRes.products || featuredRes.data || [];
      setFeaturedProducts(featuredList);

      // 3. Fetch Top 4 Products for Each Category
      const productsMap = {};
      await Promise.all(
        validCategories.map(async (cat) => {
          try {
            const res = await getProducts({ category: cat._id, limit: 4, includeInactive: false });
            const list = res.products || res.data || [];
            if (list.length > 0) {
              productsMap[cat._id] = list;
            }
          } catch (err) {
            console.error(`Failed to load products for category ${cat.name}`, err);
          }
        })
      );
      setCategoryProductsMap(productsMap);
    } catch (err) {
      console.error("Failed to load home page data:", err);
      toast.error("Failed to load storefront data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-20">
      {/* Hero 3D Slider Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <HeroSlider />
      </div>

      {/* Quick Category Chips Bar */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between gap-3 mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> Browse By Category
              </h2>
              <Link
                to="/catalog"
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => navigate("/catalog")}
                className="shrink-0 px-4 py-2.5 bg-brand-gradient text-white rounded-2xl text-xs font-bold transition-all shadow-brand-glow flex items-center gap-2 cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/catalog?category=${cat._id}`)}
                  className="shrink-0 px-4 py-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-2xl text-xs font-bold transition-all border border-slate-200/80 flex items-center gap-2 cursor-pointer"
                >
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Top Picks
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Featured Products</h2>
            </div>
            <Link
              to="/catalog?featured=true"
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View All Featured</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((prod, index) => (
                <ProductCard key={prod._id || prod.id} product={prod} index={index} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Category-Wise Product Showcase Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        {loading ? (
          <div className="space-y-8">
            <ProductGridSkeleton count={4} />
            <ProductGridSkeleton count={4} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-2xs">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No categories found</h3>
            <p className="text-slate-500 text-sm mt-1">Check back later for new inventory updates.</p>
          </div>
        ) : (
          categories.map((cat) => {
            const catProducts = categoryProductsMap[cat._id] || [];
            if (catProducts.length === 0) return null;

            return (
              <section key={cat._id} className="space-y-6">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-4">
                    {cat.image?.url ? (
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100/80">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{cat.name}</h2>
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-indigo-100/80">
                          Category
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {cat.description || `Explore our handpicked collection of ${cat.name}`}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/catalog?category=${cat._id}`}
                    className="self-start sm:self-center px-4.5 py-2.5 bg-brand-gradient hover:opacity-95 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-brand-glow cursor-pointer shrink-0"
                  >
                    <span>View All {cat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Category Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catProducts.map((prod, index) => (
                    <ProductCard key={prod._id || prod.id} product={prod} index={index} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Trust Badges Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Fast Express Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">Prompt delivery across all locations</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Secure Checkout</h4>
              <p className="text-xs text-slate-500 mt-0.5">Encrypted payment security</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">Easy 30-day exchange policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;
