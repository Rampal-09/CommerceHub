import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  PlusCircle,
  PackageCheck,
  Store,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/authContext";

/**
 * Admin Dedicated Navigation Sidebar
 */
export const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders", path: "/admin/orders", icon: PackageCheck },
    { label: "Categories", path: "/admin/categories", icon: FolderTree },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Add Product", path: "/admin/products/new", icon: PlusCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-6 shrink-0 h-fit">
      {/* Mini Admin Profile Badge */}
      <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 border border-slate-200/90 text-slate-900 rounded-2xl flex items-center gap-3.5 shadow-2xs relative overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-brand-gradient text-white overflow-hidden shrink-0 flex items-center justify-center font-black text-sm shadow-brand-glow">
          {user?.avatar?.url ? (
            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "A"}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-xs text-slate-900 truncate">{user?.name || "Admin"}</p>
          <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">
            System Admin
          </span>
        </div>
      </div>

      {/* Main Admin Section */}
      <div className="space-y-2">
        <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
          Admin Control
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-brand-gradient text-white shadow-brand-glow font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-indigo-600"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Store Navigation Section */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
          Store Links
        </div>
        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <Store className="w-4 h-4 text-indigo-600" />
          <span>Customer Storefront</span>
        </Link>
      </div>

      {/* Sign Out */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
