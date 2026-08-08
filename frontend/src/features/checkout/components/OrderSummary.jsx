import React, { useState } from "react";
import { Clock, CreditCard, Banknote, ShieldCheck, Tag, FileText, Rocket, X } from "lucide-react";
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
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    onApplyCoupon(inputCoupon);
  };

  const handlePaymentMethodClick = (id) => {
    if (id === "Card") {
      setShowComingSoon(true);
    } else {
      onPaymentMethodChange(id);
    }
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
              onClick={() => handlePaymentMethodClick(id)}
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

      {/* Coming Soon Modal for Online Payment */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full space-y-6 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/60 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-100/60 rounded-full blur-2xl pointer-events-none"></div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-100/60 rounded-full animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform -rotate-3">
                <Rocket className="w-10 h-10" />
              </div>
            </div>

            {/* Content */}
            <div className="relative space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Coming Soon!
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Online payment is currently under development. We're working hard to bring you a seamless payment experience.
              </p>
            </div>

            {/* Badge */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700">
              <CreditCard className="w-4 h-4" />
              <span>Card, UPI, Net Banking & more</span>
            </div>

            {/* Action Button */}
            <div className="relative pt-2">
              <button
                type="button"
                onClick={() => setShowComingSoon(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <Banknote className="w-4 h-4" />
                <span>Continue with Cash on Delivery</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

