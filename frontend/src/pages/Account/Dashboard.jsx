import React, { useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import DashboardCards from "../../components/Account/DashboardCards";
import LoadingSkeleton from "../../components/Account/LoadingSkeleton";

/**
 * Account Dashboard Page
 */
export const Dashboard = () => {
  const { stats, loading, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    fetchDashboardStats(true);
  }, [fetchDashboardStats]);

  if (loading) {
    return <LoadingSkeleton count={2} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Account Overview</h2>
          <p className="text-xs text-slate-500 font-medium">
            Welcome back! Here is a summary of your account metrics and recent activity.
          </p>
        </div>

        <DashboardCards stats={stats} />
      </div>
    </div>
  );
};

export default Dashboard;
