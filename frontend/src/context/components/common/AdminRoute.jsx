import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/authContext";

/**
 * 403 Forbidden Component for non-admin users
 */
const AccessDenied = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-2xs">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900">403 - Access Denied</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have administrative permissions to view this workspace area.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  </div>
);

/**
 * Route guard for Protected Admin Routes
 */
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return children;
};

export default AdminRoute;
