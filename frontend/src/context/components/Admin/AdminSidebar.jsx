import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  PlusCircle,
  BarChart3,
  Settings,
  Store,
} from "lucide-react";

/**
 * Admin Dedicated Navigation Sidebar
 */
export const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Categories", path: "/admin/categories", icon: FolderTree },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Add Product", path: "/admin/products/new", icon: PlusCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800">
        Admin Management
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-extrabold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-indigo-400"}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-800 space-y-3">
        <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Store Navigation
        </div>
        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Store className="w-4 h-4 text-indigo-400" />
          <span>Customer Storefront</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
