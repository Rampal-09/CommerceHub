import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

/**
 * Empty Wishlist State Component
 */
export const EmptyWishlist = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-16 text-center space-y-6 max-w-xl mx-auto shadow-2xs my-8">
      {/* Icon Graphic */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-red-100/60 rounded-full animate-pulse"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 transform -rotate-6">
          <Heart className="w-10 h-10 fill-white" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Save your favorite products to your wishlist so you can find them easily later or move them to your cart anytime!
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Shop Now</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyWishlist;
