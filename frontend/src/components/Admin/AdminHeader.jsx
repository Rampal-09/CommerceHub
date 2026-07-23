import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut, Store, Search } from "lucide-react";
import { useAuth } from "../../context/authContext";

/**
 * Dedicated Admin Workspace Header
 */
export const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-brand-gradient text-white font-black flex items-center justify-center text-lg shadow-brand-glow transition-all">
              CH
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight leading-none block font-display">
                CommerceHub
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Right Actions: Storefront Link & Admin Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all border border-slate-200/80 cursor-pointer"
            title="View Customer Storefront"
          >
            <Store className="w-4 h-4 text-indigo-600" />
            <span>Storefront</span>
          </Link>

          {/* Admin User Chip */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-brand-gradient text-white font-black text-xs flex items-center justify-center border border-indigo-200 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-extrabold text-slate-900 truncate max-w-[100px]">
                {user?.name || "Admin"}
              </p>
              <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                Admin
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
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
