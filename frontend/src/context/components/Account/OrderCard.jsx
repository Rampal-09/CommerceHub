import React from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";

/**
 * Order Card Component for Orders List
 */
export const OrderCard = ({ order }) => {
  const {
    _id,
    orderNumber,
    orderItems = [],
    grandTotal = 0,
    orderStatus = "Placed",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4">
      {/* Top Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <span className="font-mono font-extrabold text-slate-900 text-sm">{orderNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(
              orderStatus
            )}`}
          >
            {orderStatus}
          </span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Placed on {formattedDate}</span>
          </div>

          <div className="text-slate-600 font-semibold">
            {orderItems.length} {orderItems.length === 1 ? "Item" : "Items"}:{" "}
            <span className="text-slate-900 font-bold">
              {orderItems.map((i) => i.title).join(", ")}
            </span>
          </div>
        </div>

        {/* Right Pricing & Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Total Amount</span>
            <span className="text-base font-black text-slate-900">{formatCurrency(grandTotal)}</span>
          </div>

          <Link
            to={`/account/orders/${_id}`}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
