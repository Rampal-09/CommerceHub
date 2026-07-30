import React from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  Search,
  Filter,
  RefreshCw,
  LayoutDashboard,
  Eye,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import useAdminOrders from "../../hooks/useAdminOrders";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

export const Orders = () => {
  const {
    orders,
    loading,
    submitting,
    statusFilter,
    searchTerm,
    currentPage,
    pagination,
    setStatusFilter,
    setSearchTerm,
    handlePageChange,
    updateStatus,
    refreshOrders,
  } = useAdminOrders();

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-rise-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Link
              to="/admin/dashboard"
              className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-indigo-600">Admin Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-3">
            <PackageCheck className="w-7 h-7 text-indigo-600" />
            Order Management
          </h1>
        </div>

        <button
          onClick={refreshOrders}
          disabled={loading}
          className="p-2.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-2xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
        </button>
      </div>

      {/* Filter & Search Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number (e.g. ORD-100...)"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <span className="text-xs font-medium text-slate-500 shrink-0">
            Total: <span className="font-extrabold text-slate-900">{pagination.totalOrders}</span>
          </span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-semibold">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="No customer orders match your search or filter options."
            actionText="Reset Filters"
            onAction={() => {
              setSearchTerm("");
              setStatusFilter("");
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-4">Order #</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Status Update</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{order.user?.name || "Customer"}</p>
                      <p className="text-[11px] text-slate-400">{order.user?.email || ""}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase">
                        {order.paymentMethod || "COD"} ({order.paymentStatus || "Pending"})
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 text-sm">
                      {formatPrice(order.grandTotal)}
                    </td>
                    <td className="py-4 px-4">
                      {/* Status Dropdown */}
                      <select
                        value={order.orderStatus}
                        disabled={submitting}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="View Full Order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalOrders}
        limit={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
