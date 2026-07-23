import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag, MapPin, Calendar, Package, ArrowRight } from "lucide-react";

/**
 * Celebratory Order Success Page Component
 */
export const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  const {
    orderNumber,
    orderItems = [],
    shippingAddress = {},
    grandTotal = 0,
    paymentMethod = "COD",
    createdAt,
  } = order;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formattedDate = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Celebration Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thank you for your order!
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We've received your order and are preparing it for delivery. A confirmation email has been sent.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-800 border border-slate-200">
            <span>Order Code:</span>
            <span className="font-mono text-indigo-600 font-extrabold text-sm">{orderNumber}</span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" /> Order Summary
          </h2>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase">Date Placed</span>
              <span className="font-extrabold text-slate-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase">Payment Method</span>
              <span className="font-extrabold text-slate-800">{paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase">Total Paid</span>
              <span className="font-extrabold text-emerald-600 text-sm">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Shipping Address Snapshot */}
          {shippingAddress.fullName && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shipping Destination
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{shippingAddress.fullName}</p>
              <p className="text-slate-600 font-medium">
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""},{" "}
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </p>
              <p className="text-slate-500 font-semibold">Phone: {shippingAddress.phone}</p>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Purchased Items ({orderItems.length})
            </span>
            <div className="space-y-2">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                  <div className="flex items-center gap-3">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-xl object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</p>
                      <span className="text-slate-500">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
