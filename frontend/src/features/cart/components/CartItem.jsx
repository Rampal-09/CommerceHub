import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Image as ImageIcon, AlertTriangle } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

/**
 * Responsive Cart Item Component
 */
export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}) => {
  const product = item.product || {};
  const productId = product._id || product.id || item.product;

  const title = product.title || "Product Unavailable";
  const slug = product.slug;
  const stock = product.stock !== undefined ? product.stock : 99;
  const unitPrice = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;
  const itemTotal = unitPrice * quantity;

  const thumbnailUrl =
    product.thumbnail?.url ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null) ||
    (product.images && product.images[0]?.url);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(productId, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      onUpdateQuantity(productId, quantity + 1);
    }
  };

  const isStockLimitReached = stock !== undefined && quantity >= stock;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6 relative group">
      {/* Product Image & Basic Info */}
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        {/* Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 relative">
          {slug ? (
            <Link to={`/product/${productId}`}>
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title, Brand, Unit Price */}
        <div className="space-y-1 min-w-0 flex-1">
          {slug ? (
            <Link
              to={`/product/${productId}`}
              className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-2"
            >
              {title}
            </Link>
          ) : (
            <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
              {title}
            </span>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">
              Price: <span className="font-bold text-slate-800">{formatCurrency(unitPrice)}</span>
            </span>

            {/* Stock Limit Warning Badge */}
            {isStockLimitReached && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3" /> Max available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Desktop Action Bar (Quantity + Item Total + Remove) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
        {/* Quantity Selector */}
        <div>
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            minQuantity={1}
            maxStock={stock}
            disabled={isUpdating || isRemoving}
            loading={isUpdating}
            size="md"
          />
        </div>

        {/* Subtotal Total for this item */}
        <div className="text-right min-w-[5rem]">
          <span className="block text-[11px] uppercase font-bold text-slate-400 sm:hidden">
            Subtotal
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900">
            {formatCurrency(itemTotal)}
          </span>
        </div>

        {/* Remove Item Button */}
        <button
          type="button"
          onClick={() => onRemove(productId)}
          disabled={isRemoving || isUpdating}
          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
