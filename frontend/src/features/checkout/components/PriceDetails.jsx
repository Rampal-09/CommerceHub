import React from "react";
import { Tag, Truck, ShieldCheck, Sparkles } from "lucide-react";

/**
 * Price Details & Free Shipping Progress Component
 */
export const PriceDetails = ({ priceSummary, appliedCoupon = "", appliedDiscount = 0 }) => {
  const {
    subtotal = 0,
    discount = 0,
    shippingFee = 0,
    tax = 0,
    grandTotal = 0,
  } = priceSummary || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Free shipping threshold logic ($50)
  const FREE_SHIPPING_THRESHOLD = 50;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="space-y-4">
      {/* Free Shipping Progress Bar */}
      <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            {shippingFee === 0 ? "You unlocked FREE Shipping!" : `Add ${formatCurrency(amountNeeded)} more for FREE Shipping`}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-indigo-200/80 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-3 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Items Subtotal</span>
          <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Discount */}
        {(discount > 0 || appliedDiscount > 0) && (
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" />
              Discount {appliedCoupon ? `(${appliedCoupon})` : ""}
            </span>
            <span className="font-bold text-emerald-600">
              -{formatCurrency(discount || appliedDiscount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Shipping Fee</span>
          {shippingFee === 0 ? (
            <span className="font-bold text-emerald-600 text-xs uppercase bg-emerald-50 px-2.5 py-0.5 rounded-md">
              FREE
            </span>
          ) : (
            <span className="font-bold text-slate-900">{formatCurrency(shippingFee)}</span>
          )}
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Estimated Tax (5%)</span>
          <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
        </div>

        {/* Grand Total Divider */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <div>
            <span className="text-base font-black text-slate-900 block leading-none">
              Grand Total
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Final payable amount</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
