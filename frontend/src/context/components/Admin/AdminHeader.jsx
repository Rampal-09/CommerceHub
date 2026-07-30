import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut, Store, Search, Bell } from "lucide-react";
import { useAuth } from "../../context/authContext";

/**
 * Dedicated Admin Workspace Header (Option B Layout)
 */
export const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
              CH
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight leading-none block">
                CommerceHub
              </span>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
                Enterprise Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Center Admin Quick Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search admin products, orders, or categories..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right Actions: Storefront Link & Admin Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
            title="View Storefront"
          >
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span>Storefront</span>
          </Link>

          {/* Admin User Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="hidden lg:inline-block text-xs font-bold text-slate-200">
              {user?.name || "Admin"}
            </span>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
