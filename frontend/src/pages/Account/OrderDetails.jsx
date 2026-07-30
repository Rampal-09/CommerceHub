import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import LoadingSkeleton from "../../components/Account/LoadingSkeleton";
import {
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

/**
 * Account Single Order Details Page
 */
export const OrderDetails = () => {
  const { id } = useParams();
  const { selectedOrder, loading, fetchOrderById } = useOrders();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (loading || !selectedOrder) {
    return <LoadingSkeleton count={3} />;
  }

  const {
    orderNumber,
    orderItems = [],
    shippingAddress = {},
    subtotal = 0,
    discount = 0,
    shippingFee = 0,
    tax = 0,
    grandTotal = 0,
    paymentMethod = "COD",
    paymentStatus = "Pending",
    orderStatus = "Placed",
    createdAt,
  } = selectedOrder;

  const formattedDate = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order History</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {orderStatus}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" /> Order Details
            </h2>
            <p className="text-xs font-mono font-bold text-indigo-600 mt-1">
              Order Code: {orderNumber}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <span className="text-slate-400 font-semibold block">Date Placed</span>
            <span className="font-extrabold text-slate-800">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
          </h3>
          {shippingAddress.fullName ? (
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">{shippingAddress.fullName}</p>
              <p className="text-slate-600 font-medium leading-relaxed">
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""},{" "}
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </p>
              <p className="text-slate-500 font-semibold pt-1">Phone: {shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">Address unavailable</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Details
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment Method:</span>
              <span className="font-bold text-slate-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment Status:</span>
              <span className="font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                {paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2">
              <span className="text-slate-700 font-bold">Total Paid:</span>
              <span className="font-black text-slate-900 text-sm">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          Items Purchased ({orderItems.length})
        </h3>

        <div className="space-y-3">
          {orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</p>
                  <p className="text-slate-500 font-medium">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                <span className="font-black text-slate-900 text-sm">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2 max-w-sm ml-auto text-xs font-medium text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold text-slate-900">
              {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
