import React from "react";

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-3xl border border-slate-200 overflow-hidden space-y-4 p-4"
        >
          <div className="w-full aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded-md w-4/5"></div>
            <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
