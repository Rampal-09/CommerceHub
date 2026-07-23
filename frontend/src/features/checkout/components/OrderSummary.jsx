import React, { useState } from "react";
import { Clock, CreditCard, Banknote, ShieldCheck, Tag, FileText } from "lucide-react";
import PriceDetails from "./PriceDetails";
import PlaceOrderButton from "./PlaceOrderButton";

/**
 * Sticky Order Summary Sidebar for Checkout Page
 */
export const OrderSummary = ({
  priceSummary,
  paymentMethod,
  onPaymentMethodChange,
  orderNotes,
  onOrderNotesChange,
  onApplyCoupon,
  couponCode,
  appliedDiscount,
  onPlaceOrder,
  isPlacingOrder = false,
  isCartEmpty = false,
  isAddressMissing = false,
}) => {
  const [inputCoupon, setInputCoupon] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    onApplyCoupon(inputCoupon);
  };

  const isButtonDisabled = isCartEmpty || isAddressMissing || isPlacingOrder;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
      <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
        Order Summary
      </h2>

      {/* Delivery Estimate */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3 text-xs text-slate-700">
        <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
        <div>
          <span className="font-extrabold block text-slate-900">Estimated Delivery</span>
          <span className="text-slate-500 font-medium">3 - 5 Business Days</span>
        </div>
      </div>

      {/* Price Details */}
      <PriceDetails
        priceSummary={priceSummary}
        appliedCoupon={couponCode}
        appliedDiscount={appliedDiscount}
      />

      {/* Payment Method Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "COD", label: "Cash on Delivery", icon: Banknote },
            { id: "Card", label: "Card / Online", icon: CreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onPaymentMethodChange(id)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Coupon Code Input */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Promo Code
        </label>
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            value={inputCoupon}
            onChange={(e) => setInputCoupon(e.target.value)}
            placeholder="Try WELCOME10"
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Order Notes (Bonus Feature) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-indigo-600" /> Order Notes / Instructions
        </label>
        <textarea
          rows={2}
          value={orderNotes}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          placeholder="Special delivery instructions (e.g. Leave at front door)"
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        ></textarea>
      </div>

      {/* Place Order Button */}
      <PlaceOrderButton
        onPlaceOrder={onPlaceOrder}
        disabled={isButtonDisabled}
        isPlacingOrder={isPlacingOrder}
      />
    </div>
  );
};

export default OrderSummary;
