import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { UserCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../context/authContext";

/**
 * Account Section Main Responsive Layout Wrapper
 */
export const AccountLayout = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

  if (user?.role === "admin" && location.pathname !== "/account/change-password") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
        {/* Soft Ambient Depth Blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-3">
          <Breadcrumb items={[{ label: "My Account" }]} />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-indigo-600" /> Account Settings
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Manage your personal profile, addresses, orders, and account security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar userProfile={profile} />
          </div>

          {/* Subpage Outlet Content */}
          <div className="lg:col-span-3 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
