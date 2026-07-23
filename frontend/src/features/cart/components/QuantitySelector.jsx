import React from "react";
import { Minus, Plus, Loader2 } from "lucide-react";

/**
 * Reusable Quantity Selector component [-] Qty [+]
 */
export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxStock,
  disabled = false,
  loading = false,
  size = "md",
}) => {
  const isMin = quantity <= minQuantity;
  const isMax = maxStock !== undefined && quantity >= maxStock;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs font-bold",
    md: "px-3 py-1.5 text-sm font-extrabold",
    lg: "px-4 py-2 text-base font-black",
  };

  const buttonClasses = {
    sm: "p-1 text-xs",
    md: "p-1.5 text-sm",
    lg: "p-2 text-base",
  };

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="inline-flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shadow-2xs">
        {/* Decrease Button */}
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled || loading || isMin}
          title={isMin ? `Minimum quantity is ${minQuantity}` : "Decrease quantity"}
          className={`${buttonClasses[size]} text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Quantity Display */}
        <div className={`${sizeClasses[size]} min-w-[2.5rem] text-center text-slate-900 flex items-center justify-center`}>
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
          ) : (
            quantity
          )}
        </div>

        {/* Increase Button */}
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled || loading || isMax}
          title={isMax ? `Maximum available stock is ${maxStock}` : "Increase quantity"}
          className={`${buttonClasses[size]} text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stock warning if quantity reaches available stock */}
      {isMax && maxStock !== undefined && (
        <span className="text-[10px] font-bold text-amber-600">Max stock reached</span>
      )}
    </div>
  );
};

export default QuantitySelector;
