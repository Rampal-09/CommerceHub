import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";

export const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, actionLoading, itemActionId } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const isAdmin = user?.role === "admin";
  const productId = product._id || product.id;
  const isAddingThisItem = actionLoading && itemActionId === productId;
  const wishlisted = isWishlisted(productId);

  const thumbnailUrl =
    product.thumbnail?.url ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null) ||
    (product.images && product.images[0]?.url);

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin) {
      toast.error("Administrators cannot add products to cart.");
      return;
    }
    if (productId) {
      await addToCart(productId, 1);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Thumbnail Header Container */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden shrink-0">
        {/* Category & Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.category?.name && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[10px] font-bold rounded-full shadow-2xs">
              {product.category.name}
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Featured
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-full shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Image */}
        <Link to={`/product/${product._id || product.id}`} className="block w-full h-full">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"
            style={{ display: thumbnailUrl ? "none" : "flex" }}
          >
            <ImageIcon className="w-10 h-10" />
          </div>
        </Link>

        {/* Quick Wishlist Hover/Active Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute bottom-3 right-3 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md transition-all cursor-pointer ${
            wishlisted
              ? "text-red-500 opacity-100"
              : "text-slate-700 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100"
          }`}
          title={isAdmin ? "Administrators cannot perform wishlist actions" : (wishlisted ? "Remove from Wishlist" : "Add to Wishlist")}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Rating Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.ratings || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              ({product.totalReviews || 0})
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product._id || product.id}`}
            className="block font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {hasDiscount ? (
              <div>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddingThisItem}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0"
            title={isAdmin ? "Administrators cannot add items to cart" : "Add to Cart"}
          >
            {isAddingThisItem ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            <span>{isAddingThisItem ? "Adding..." : "Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
