import React from "react";
import { Link } from "react-router-dom";
import { PackageX, ArrowLeft } from "lucide-react";

/**
 * Reusable Empty State Display Component
 */
export const EmptyState = ({
  icon: Icon = PackageX,
  title = "No items found",
  message = "There are no records to display at the moment.",
  actionText = "Continue Shopping",
  actionLink = "/products",
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-5 my-4">
      <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto border border-slate-200/80">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{message}</p>
      </div>

      {actionLink && (
        <div className="pt-2">
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
