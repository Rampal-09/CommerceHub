import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
  FolderTree,
} from "lucide-react";
import useAdminDashboard from "../../hooks/useAdminDashboard";
import Loader from "../../components/common/Loader";

export const AdminDashboard = () => {
  const { stats, lowStockProducts, recentOrders, loading, error, refreshDashboard } =
    useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <Loader message="Loading admin workspace analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-sm text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 font-display">Dashboard Loading Failed</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          onClick={refreshDashboard}
          className="px-4 py-2 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-brand-glow cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

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

  const statusIcons = {
    Placed: Clock,
    Processing: RefreshCw,
    Shipped: Truck,
    Delivered: CheckCircle2,
    Cancelled: XCircle,
  };

  return (
    <div className="space-y-8 animate-rise-in font-sans text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block mb-1">
            Enterprise Command Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
            Admin Overview
          </h1>
        </div>

        <button
          onClick={refreshDashboard}
          className="px-4 py-2.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Row 1: KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900">
              {formatPrice(stats?.totalRevenue)}
            </h2>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Platform Lifetime Sales</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900">
              {stats?.totalOrders || 0}
            </h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold mt-1 hover:underline cursor-pointer"
            >
              <span>Manage all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Catalog
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900">
              {stats?.totalProducts || 0}
            </h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold mt-1 hover:underline cursor-pointer"
            >
              <span>{stats?.totalCategories || 0} categories active</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Total Registered Customers */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customers
            </span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900">
              {stats?.totalUsers || 0}
            </h2>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              Registered Accounts
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Order Status Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-indigo-600" />
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400">Latest customer transactions</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold">
              No recent orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-indigo-600">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {order.user?.name || "Customer"}
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-slate-900">
                        {formatPrice(order.grandTotal)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold rounded-xl transition-all inline-block text-[11px]"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Order Status Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Order Status Breakdown
            </h2>
            <p className="text-xs text-slate-400">Current fulfillment queue</p>
          </div>

          <div className="space-y-3">
            {Object.entries(stats?.orderStatusBreakdown || {}).map(([status, count]) => {
              const IconComp = statusIcons[status] || Clock;
              return (
                <div
                  key={status}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${getStatusBadge(
                        status
                      )}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{status}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Low Stock Alerts */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Inventory Alerts
            </h2>
            <p className="text-xs text-slate-400">Products requiring restock attention (&lt; 10 units)</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Manage Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="p-6 text-center text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All inventory stock levels are healthy! No low stock warnings.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((prod) => (
              <div
                key={prod._id}
                className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">{prod.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {prod.category?.name || "General"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 bg-red-600 text-white font-black text-xs rounded-full inline-block">
                    {prod.stock} left
                  </span>
                  <Link
                    to={`/admin/products/edit/${prod._id}`}
                    className="block text-[10px] font-bold text-indigo-600 hover:underline mt-1"
                  >
                    Edit Stock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
