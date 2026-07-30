import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/authContext";

/**
 * Account Sidebar Navigation
 */
export const Sidebar = ({ userProfile }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  const customerNavItems = [
    { label: "Dashboard", path: "/account/dashboard", icon: LayoutDashboard },
    { label: "My Profile", path: "/account/profile", icon: User },
    { label: "My Orders", path: "/account/orders", icon: Package },
    { label: "My Wishlist", path: "/account/wishlist", icon: Heart },
    { label: "Saved Addresses", path: "/account/addresses", icon: MapPin },
    { label: "Change Password", path: "/account/change-password", icon: Lock },
  ];

  const adminNavItems = [
    { label: "Admin Workspace", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Products", path: "/admin/products", icon: Package },
    { label: "Change Password", path: "/account/change-password", icon: Lock },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  const isActive = (path) => location.pathname === path;

  const avatarUrl = userProfile?.avatar?.url;
  const name = userProfile?.name || "User";
  const email = userProfile?.email || "";

  return (
    <aside className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-6">
      {/* Mini Profile Card Header */}
      <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 border border-slate-200/90 text-slate-900 rounded-2xl flex items-center gap-3.5 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-brand-gradient text-white overflow-hidden shrink-0 flex items-center justify-center font-black text-lg shadow-brand-glow">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-sm text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-500 font-medium truncate">{email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 font-extrabold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-indigo-600"}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
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

export default Sidebar;
