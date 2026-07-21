import React from "react";

export const TableSkeleton = ({ rows = 4 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse border-b border-slate-100">
          <td className="px-6 py-4">
            <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded-md w-36 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded-md w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-3.5 bg-slate-200 rounded-md w-28 font-mono"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-3.5 bg-slate-200 rounded-md w-24"></div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <svg
        className="animate-spin h-9 w-9 text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {message && (
        <p className="text-sm font-medium text-slate-500">{message}</p>
      )}
    </div>
  );
};

export default Loader;
