import React from "react";
import { Edit2, Trash2, Star, Package, Image as ImageIcon } from "lucide-react";

export const ProductRow = ({ product, onEdit, onDelete }) => {
  const thumbnailUrl =
    product.thumbnail?.url ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null) ||
    (product.images && product.images[0]?.url);

  // Price formatting
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;

  // Stock status pill
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <Package className="w-3 h-3 text-slate-500" />
        {stock} in stock
      </span>
    );
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 group">
      {/* Thumbnail */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-[60px] h-[60px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </td>

      {/* Product Name & SKU */}
      <td className="px-6 py-4 max-w-xs">
        <div className="font-bold text-slate-900 text-sm truncate" title={product.title}>
          {product.title}
        </div>
        {product.sku && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 border border-slate-200/60 rounded font-mono text-[10px] text-slate-500">
            SKU: {product.sku}
          </span>
        )}
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold">
          {product.category?.name || "Uncategorized"}
        </span>
      </td>

      {/* Price */}
      <td className="px-6 py-4 whitespace-nowrap">
        {hasDiscount ? (
          <div>
            <div className="font-extrabold text-indigo-600 text-sm">
              {formatPrice(product.discountPrice)}
            </div>
            <div className="text-xs text-slate-400 line-through">
              {formatPrice(product.price)}
            </div>
          </div>
        ) : (
          <div className="font-bold text-slate-900 text-sm">
            {formatPrice(product.price)}
          </div>
        )}
      </td>

      {/* Stock */}
      <td className="px-6 py-4 whitespace-nowrap">
        {getStockBadge(product.stock)}
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            product.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.isActive ? "bg-emerald-500" : "bg-slate-400"
            }`}
          ></span>
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Featured */}
      <td className="px-6 py-4 whitespace-nowrap">
        {product.isFeatured ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            Featured
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Standard</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
