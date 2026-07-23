import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Custom hook to manage user dashboard metrics & stats
 */
export const useDashboard = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useDashboard must be used within a UserProvider");
  }

  const { dashboardStats, loading, fetchDashboardStats } = context;

  return {
    stats: dashboardStats,
    loading,
    fetchDashboardStats,
  };
};

export default useDashboard;
