import React from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, AlertTriangle } from "lucide-react";

/**
 * Checkout Item Component
 */
export const CheckoutItem = ({ item }) => {
  const product = item.product || {};
  const productId = product._id || product.id || item.product;

  const title = product.title || item.title || "Product";
  const slug = product.slug || item.slug;
  const unitPrice = Number(item.price || product.price) || 0;
  const quantity = Number(item.quantity) || 1;
  const itemTotal = unitPrice * quantity;
  const stock = product.stock !== undefined ? product.stock : 99;

  const thumbnailUrl =
    product.thumbnail?.url ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null) ||
    item.thumbnail ||
    (product.images && product.images[0]?.url);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isStockLimit = stock !== undefined && quantity >= stock;

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
      {/* Product Image & Basic Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
          {slug ? (
            <Link to={`/product/${productId}`}>
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          {slug ? (
            <Link
              to={`/product/${productId}`}
              className="font-bold text-slate-900 text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {title}
            </Link>
          ) : (
            <span className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
              {title}
            </span>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span>
              Price: <span className="font-bold text-slate-800">{formatCurrency(unitPrice)}</span>
            </span>
            <span>
              Qty: <span className="font-extrabold text-slate-900">{quantity}</span>
            </span>
          </div>

          {isStockLimit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3" /> Max available stock
            </span>
          )}
        </div>
      </div>

      {/* Subtotal Item Total */}
      <div className="text-right shrink-0">
        <span className="text-xs text-slate-400 block font-medium">Item Total</span>
        <span className="text-base font-black text-slate-900">{formatCurrency(itemTotal)}</span>
      </div>
    </div>
  );
};

export default CheckoutItem;
