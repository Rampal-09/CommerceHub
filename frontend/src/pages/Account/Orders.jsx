import React, { useEffect, useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import OrderList from "../../components/Account/OrderList";
import LoadingSkeleton from "../../components/Account/LoadingSkeleton";
import EmptyState from "../../components/Account/EmptyState";
import { Package, PackageX } from "lucide-react";

/**
 * Account Orders History Page
 */
export const Orders = () => {
  const { orders, page, totalPages, totalOrders, loading, fetchOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders(currentPage, 10, true);
  }, [fetchOrders, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" /> Order History
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          View all your past and active orders, track status, and view order receipts.
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="No orders found"
          message="You haven't placed any orders yet. Start shopping to explore our products!"
          actionText="Browse Products"
          actionLink="/products"
        />
      ) : (
        <OrderList
          orders={orders}
          page={page}
          totalPages={totalPages}
          totalOrders={totalOrders}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Orders;
