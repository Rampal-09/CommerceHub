import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

/**
 * Dedicated Admin Workspace Main Layout
 */
export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col pb-16">
      {/* Admin Dedicated Workspace Header */}
      <AdminHeader />

      {/* Main Workspace Body with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 flex flex-col lg:flex-row gap-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
