import React from "react";
import OrderCard from "./OrderCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Order List Component with Pagination Controls
 */
export const OrderList = ({
  orders = [],
  page = 1,
  totalPages = 1,
  totalOrders = 0,
  onPageChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Orders Cards Grid */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <span className="text-xs text-slate-500 font-semibold">
            Showing Page <span className="font-extrabold text-slate-900">{page}</span> of{" "}
            <span className="font-extrabold text-slate-900">{totalPages}</span> ({totalOrders} Total Orders)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
