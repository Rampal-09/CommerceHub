import React from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";

/**
 * Place Order Action Button
 */
export const PlaceOrderButton = ({
  onPlaceOrder,
  disabled = false,
  isPlacingOrder = false,
}) => {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={disabled || isPlacingOrder}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-black text-base transition-all shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isPlacingOrder ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-semibold">
        <Lock className="w-3.5 h-3.5 text-indigo-600" />
        <span>By placing order you agree to our Terms & Privacy Policy</span>
      </div>
    </div>
  );
};

export default PlaceOrderButton;
