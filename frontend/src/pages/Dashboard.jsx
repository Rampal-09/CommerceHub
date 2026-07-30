import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 shadow-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-semibold text-slate-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500">Please log in to view this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-200">
              CH
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">CommerceHub</h1>
              <p className="text-xs text-slate-500">Dashboard & Account Profile</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loggingOut ? (
              <span>Logging out...</span>
            ) : (
              <>
                <span>🚪</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </header>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                Authenticated User
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="block text-xs font-semibold text-slate-400 uppercase">User ID</span>
              <span className="font-mono text-slate-800 text-xs mt-1 block truncate">{user._id}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Joined Date</span>
              <span className="text-slate-800 text-xs mt-1 block">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) : "N/A"}
              </span>
            </div>
          </div>

          {/* Quick Storefront Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Storefront</h3>
              <p className="text-xs text-slate-500">Browse product catalog, search items and view product details</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>🛍️</span>
              <span>Browse Customer Store</span>
            </button>
          </div>

          {/* Quick Admin Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admin Modules</h3>
              <p className="text-xs text-slate-500">Manage categories, inventory and store catalog</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/categories")}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
              >
                <span>📁</span>
                <span>Category Management</span>
              </button>
              <button
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>📦</span>
                <span>Product Management</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
