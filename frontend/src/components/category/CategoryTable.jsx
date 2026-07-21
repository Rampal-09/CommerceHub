import React from "react";
import CategoryRow from "./CategoryRow";
import { TableSkeleton } from "../common/Loader";
import EmptyState from "../common/EmptyState";

export const CategoryTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onAddCategory,
  searchTerm,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Image</th>
                <th className="px-6 py-3.5">Category Name</th>
                <th className="px-6 py-3.5">Slug</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Created At</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableSkeleton rows={5} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title={searchTerm ? "No matching categories" : "No categories found."}
        description={
          searchTerm
            ? `No categories matching "${searchTerm}" were found. Try adjusting your search term.`
            : "Create your first category."
        }
        actionText={searchTerm ? "Clear Search" : "Create Category"}
        onAction={onAddCategory}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3.5">Image</th>
              <th className="px-6 py-3.5">Category Name</th>
              <th className="px-6 py-3.5">Slug</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Created At</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <CategoryRow
                key={category._id || category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
