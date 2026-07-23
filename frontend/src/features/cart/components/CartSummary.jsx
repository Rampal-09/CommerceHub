import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Tag, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Cart Summary & Checkout Sidebar Component
 */
export const CartSummary = ({
  subtotal = 0,
  total = 0,
  itemCount = 0,
  onClearCart,
  isClearing = false,
}) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const handleCheckout = () => {
    if (itemCount === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  const confirmClear = async () => {
    setShowConfirmModal(false);
    await onClearCart();
  };

  const isEmpty = itemCount === 0;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
      <h2 className="text-lg font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-4">
        <span>Order Summary</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          {itemCount} {itemCount === 1 ? "Item" : "Items"}
        </span>
      </h2>

      {/* Breakdown List */}
      <div className="space-y-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-emerald-600" /> Discount
          </span>
          <span className="font-bold text-emerald-600">{formatCurrency(0)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" /> Shipping
          </span>
          <span className="font-bold text-emerald-600 uppercase text-xs tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
            FREE
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
          <div>
            <span className="text-base font-black text-slate-900 block leading-none">Total Amount</span>
            <span className="text-[11px] text-slate-400 font-medium">Taxes included</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Checkout Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isEmpty || isClearing}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-black text-base transition-all shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Clear Cart Button */}
        {!isEmpty && (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isClearing}
            className="w-full py-2.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-indigo-600" />
        <span>Secure 256-bit Encrypted Checkout</span>
      </div>

      {/* Confirmation Modal Dialog for Clear Cart */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Clear your cart?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove all items from your shopping cart? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClear}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
