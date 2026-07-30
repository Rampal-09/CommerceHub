import React from "react";

/**
 * Account Skeleton Loader
 */
export const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
        <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200/80 p-4">
            <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
