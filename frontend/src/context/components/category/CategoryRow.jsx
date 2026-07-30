import React from "react";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export const CategoryRow = ({ category, onEdit, onDelete }) => {
  // Format creation date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const imageUrl = category.image?.url || category.image;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-0 group">
      {/* Image Thumbnail (~60x60) */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-[60px] h-[60px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={category.name}
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
            style={{ display: imageUrl ? "none" : "flex" }}
          >
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </td>

      {/* Category Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-bold text-slate-900 text-sm">{category.name}</div>
      </td>

      {/* Slug */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200/60 rounded-md font-mono text-xs text-slate-600">
          {category.slug || "—"}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            category.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              category.isActive ? "bg-emerald-500" : "bg-slate-400"
            }`}
          ></span>
          {category.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Created At */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
        {formatDate(category.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
            title="Edit Category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;
