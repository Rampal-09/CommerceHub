import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronRight,
  Package,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ProductCard from "../../components/customer/ProductCard";
import { getProduct, getProducts } from "../../services/productService";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, actionLoading, itemActionId } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const isAdmin = user?.role === "admin";
  const wishlisted = isWishlisted(id);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch Product Details by ID
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProduct(id);
      const data = res.data || res.product || res;
      setProduct(data);

      // Set initial selected image (thumbnail or first gallery image)
      const initialImg =
        data?.thumbnail?.url ||
        (typeof data?.thumbnail === "string" ? data.thumbnail : null) ||
        (data?.images && data.images[0]?.url);
      setSelectedImage(initialImg);

      // Fetch related products in the same category
      if (data?.category?._id || data?.category) {
        const catId = data.category._id || data.category;
        const relRes = await getProducts({ category: catId, limit: 4 });
        const relList = (relRes.products || relRes.data || []).filter(
          (p) => (p._id || p.id) !== id
        );
        setRelatedProducts(relList.slice(0, 4));
      }
    } catch (err) {
      console.error("Fetch product details error:", err);
      toast.error("Failed to load product details.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <Loader message="Loading product details..." />
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Format currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Build image gallery list (thumbnail + images array)
  const allImages = [];
  if (product.thumbnail?.url) {
    allImages.push(product.thumbnail.url);
  } else if (typeof product.thumbnail === "string") {
    allImages.push(product.thumbnail);
  }

  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      const url = img.url || (typeof img === "string" ? img : null);
      if (url && !allImages.includes(url)) {
        allImages.push(url);
      }
    });
  }

  const productId = product?._id || product?.id || id;
  const isAddingThisItem = actionLoading && itemActionId === productId;

  const handleAddToCart = async () => {
    if (isAdmin) {
      toast.error("Administrators cannot add products to cart.");
      return;
    }
    if (productId) {
      await addToCart(productId, quantity);
    }
  };

  const handleToggleWishlist = async () => {
    if (isAdmin) {
      toast.error("Administrators cannot add products to wishlist.");
      return;
    }
    if (productId) {
      if (wishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/products" className="hover:text-indigo-600">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-indigo-600">
            Products
          </Link>
          {product.category?.name && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-700">{product.category.name}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600 font-bold truncate max-w-xs">
            {product.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs animate-rise-in">
          {/* Left Column: Image Gallery View */}
          <div className="space-y-4">
            {/* Main Active Image Display */}
            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-12 h-12" />
                  <span className="text-xs font-semibold">No Image Available</span>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-md">
                  SAVE {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-100 ${
                      selectedImage === imgUrl
                        ? "border-violet-500 ring-2 ring-violet-200"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category Badge & Brand */}
              <div className="flex items-center gap-2">
                {product.category?.name && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
                {product.brand && (
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Brand: <span className="text-slate-800 font-bold">{product.brand}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Ratings & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.ratings || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {product.ratings || 0} / 5.0
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-semibold text-slate-500">
                  {product.totalReviews || 0} Customer Reviews
                </span>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-black text-slate-900">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Availability:
                </span>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-extrabold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingThisItem}
                  className="flex-1 py-3.5 bg-brand-gradient text-white rounded-2xl font-bold text-sm transition-all shadow-brand-glow shadow-brand-glow-hover hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  title={isAdmin ? "Administrators cannot perform purchasing actions" : "Add to Cart"}
                >
                  {isAddingThisItem ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  <span>{isAddingThisItem ? "Adding to Cart..." : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 border rounded-2xl transition-all shadow-2xs hover:shadow-md cursor-pointer ${
                    wishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-red-500"
                  }`}
                  title={isAdmin ? "Administrators cannot perform wishlist actions" : (wishlisted ? "Remove from Wishlist" : "Add to Wishlist")}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-600 text-red-600" : ""}`} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-[11px] font-semibold text-slate-500">
              <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Fast Express Shipping</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic Product</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Easy 7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Specifications Section */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📝</span> Detailed Product Description
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>⚙️</span> Technical Specifications
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {product.specifications.map((spec, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}
                      >
                        <td className="px-5 py-3 font-bold text-slate-700 w-1/3 border-r border-slate-200/80">
                          {spec.key}
                        </td>
                        <td className="px-5 py-3 text-slate-800 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>✨</span> Related Products You Might Like
              </h2>
              <Link
                to="/products"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View All Products</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id || relProd.id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
