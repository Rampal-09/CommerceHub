import React from "react";
import { Link } from "react-router-dom";
import { Package, Heart, DollarSign, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

/**
 * Dashboard Overview Metric Cards Component
 */
export const DashboardCards = ({ stats = {} }) => {
  const {
    totalOrders = 0,
    wishlistCount = 0,
    totalAmountSpent = 0,
    recentOrders = [],
  } = stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const metricCards = [
    {
      title: "Total Orders",
      value: totalOrders,
      subtitle: "Orders placed to date",
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      link: "/account/orders",
    },
    {
      title: "Wishlist Items",
      value: wishlistCount,
      subtitle: "Items saved for later",
      icon: Heart,
      gradient: "from-rose-500 to-red-600",
      link: "/account/wishlist",
    },
    {
      title: "Total Spending",
      value: formatCurrency(totalAmountSpent),
      subtitle: "Lifetime purchases amount",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      link: "/account/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {metricCards.map(({ title, value, subtitle, icon: Icon, gradient, link }) => (
          <Link
            key={title}
            to={link}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
              </span>
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <span className="text-3xl font-black text-slate-900 block tracking-tight">
                {value}
              </span>
              <span className="text-xs text-slate-500 font-medium block">{subtitle}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Recent Orders
          </h3>
          <Link
            to="/account/orders"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium text-center py-6">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord._id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-indigo-600">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <span className="text-slate-400 block font-medium">
                    {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderItems?.length || 0} items
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm block">
                    {formatCurrency(ord.grandTotal)}
                  </span>
                  <Link
                    to={`/account/orders/${ord._id}`}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    View Details →
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

export default DashboardCards;
