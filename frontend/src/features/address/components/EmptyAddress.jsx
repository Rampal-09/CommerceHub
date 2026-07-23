import React from "react";
import { MapPin, Plus } from "lucide-react";

/**
 * Empty Address Component displayed when user has no saved addresses
 */
export const EmptyAddress = ({ onAddClick }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-16 text-center space-y-6 max-w-lg mx-auto shadow-2xs my-8">
      {/* Icon Graphic */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-100/60 rounded-full animate-pulse"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform rotate-3">
          <MapPin className="w-10 h-10" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          No saved addresses
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          You haven't added any shipping addresses yet. Add an address for fast and easy checkout.
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyAddress;
