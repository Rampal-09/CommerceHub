import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Star, Check, AlertTriangle, Image as ImageIcon, Loader2, Calendar } from "lucide-react";

/**
 * Responsive Wishlist Item Card Component
 */
export const WishlistItem = ({
  item,
  onRemove,
  onMoveToCart,
  isLoading = false,
}) => {
  const product = item.product || {};
  const productId = product._id || product.id || item.product;

  const title = product.title || "Product Unavailable";
  const slug = product.slug;
  const brand = product.brand;
  const categoryName = product.category?.name || product.category;
  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const stock = product.stock !== undefined ? product.stock : 0;
  const addedAt = item.addedAt;

  const thumbnailUrl =
    product.thumbnail?.url ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null) ||
    (product.images && product.images[0]?.url);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const sellingPrice = hasDiscount ? discountPrice : price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const formattedDate = addedAt
    ? new Date(addedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden relative group">
      {/* Top Header Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden shrink-0">
        {/* Category Badge & Discount */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {categoryName && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[10px] font-bold rounded-full shadow-2xs uppercase">
              {categoryName}
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-full shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Thumbnail Link */}
        {slug ? (
          <Link to={`/product/${productId}`} className="block w-full h-full">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon className="w-10 h-10" />
              </div>
            )}
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}

        {/* Quick Delete Hover Button */}
        <button
          type="button"
          onClick={() => onRemove(productId)}
          disabled={isLoading}
          className="absolute bottom-3 right-3 z-10 p-2.5 bg-white/90 backdrop-blur-md text-slate-500 hover:text-red-600 hover:bg-white rounded-full shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Stock Status Badge */}
          <div className="flex items-center justify-between text-xs gap-2">
            {brand ? (
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {brand}
              </span>
            ) : (
              <span></span>
            )}

            {stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" /> In Stock ({stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                <AlertTriangle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>

          {/* Title */}
          {slug ? (
            <Link
              to={`/product/${productId}`}
              className="block font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-2"
            >
              {title}
            </Link>
          ) : (
            <span className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {title}
            </span>
          )}

          {/* Added Date */}
          {formattedDate && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Added on {formattedDate}</span>
            </div>
          )}
        </div>

        {/* Price & Move to Cart Action */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(discountPrice)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-black text-slate-900">
                  {formatCurrency(price)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMoveToCart(productId)}
              disabled={stock <= 0 || isLoading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? "Moving..." : "Move to Cart"}</span>
            </button>

            <button
              type="button"
              onClick={() => onRemove(productId)}
              disabled={isLoading}
              className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              title="Remove Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
