import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

/**
 * Empty Checkout State Component
 */
export const EmptyCheckout = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-16 text-center space-y-6 max-w-xl mx-auto shadow-2xs my-8">
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-100/60 rounded-full animate-pulse"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform -rotate-3">
          <ShoppingBag className="w-10 h-10" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          You don't have any items in your cart to checkout. Browse our store to add products to your cart.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCheckout;
