import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PackageCheck,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import api from "../../api/auth";
import { updateOrderStatus } from "../../services/adminService";

export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/orders/${id}`);
      const data = res.data?.order || res.data;
      setOrder(data);
    } catch (err) {
      console.error("Fetch admin order details error:", err);
      toast.error("Failed to load order details.");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleStatusChange = async (newStatus) => {
    try {
      setSubmitting(true);
      const res = await updateOrderStatus(id, newStatus);
      if (res.success) {
        toast.success(`Order status updated to '${newStatus}'.`);
        setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <Loader message="Loading order receipt details..." />
      </div>
    );
  }

  if (!order) return null;

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
    <div className="space-y-8 font-sans text-slate-800 animate-rise-in max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/admin/orders" className="hover:text-indigo-600 transition-colors">
              Orders
            </Link>
            <span>/</span>
            <span className="text-indigo-600">{order.orderNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-3">
            <PackageCheck className="w-7 h-7 text-indigo-600" />
            Order #{order.orderNumber}
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin/orders")}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>
      </div>

      {/* Main Grid: Order Details & Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Items & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3">
              Order Items ({order.orderItems?.length || 0})
            </h2>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PackageCheck className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quantity: <span className="font-bold text-slate-700">{item.quantity}</span> ×{" "}
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3 text-xs">
            <h2 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3">
              Price Breakdown
            </h2>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-bold text-slate-800">{formatPrice(order.shippingFee)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Tax:</span>
              <span className="font-bold text-slate-800">{formatPrice(order.tax)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-base font-display text-indigo-600">
                {formatPrice(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Status Control & Shipping Address */}
        <div className="space-y-6">
          {/* Status Control Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3">
              Order Status Control
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">
                Update Fulfillment Status:
              </label>
              <select
                value={order.orderStatus}
                disabled={submitting}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                <option value="Placed">Placed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 space-y-1">
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod || "COD"}
              </p>
              <p>
                <strong>Payment Status:</strong> {order.paymentStatus || "Pending"}
              </p>
              <p>
                <strong>Ordered On:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Delivery Destination
            </h2>

            {order.shippingAddress ? (
              <div className="space-y-1 text-slate-700">
                <p className="font-extrabold text-slate-900 text-sm">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="font-semibold text-slate-900 mt-2">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-slate-400">No shipping address recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
