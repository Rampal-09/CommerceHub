import React from "react";
import ProductRow from "./ProductRow";
import { TableSkeleton } from "../common/Loader";
import EmptyState from "../common/EmptyState";

export const ProductTable = ({
  products,
  loading,
  onEdit,
  onDelete,
  onAddProduct,
  searchTerm,
  selectedCategory,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Thumbnail</th>
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Featured</th>
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

  if (!products || products.length === 0) {
    const isFiltered = Boolean(searchTerm || selectedCategory);
    return (
      <EmptyState
        title={isFiltered ? "No matching products found" : "No products found."}
        description={
          isFiltered
            ? "No products matched your search or category filters. Try clearing your filters."
            : "Get started by adding your first product to the catalog."
        }
        actionText={isFiltered ? "Clear Filters" : "Add Product"}
        onAction={onAddProduct}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3.5">Thumbnail</th>
              <th className="px-6 py-3.5">Product Name</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Stock</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Featured</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <ProductRow
                key={product._id || product.id}
                product={product}
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

export default ProductTable;
