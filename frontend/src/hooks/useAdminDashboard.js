import { useState, useEffect, useCallback } from "react";
import { getAdminDashboardStats } from "../services/adminService";
import toast from "react-hot-toast";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminDashboardStats();
      if (data.success) {
        setStats(data.stats);
        setLowStockProducts(data.lowStockProducts || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard stats:", err);
      const msg = err.response?.data?.message || "Failed to load dashboard statistics.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    lowStockProducts,
    recentOrders,
    loading,
    error,
    refreshDashboard: fetchDashboardData,
  };
};

export default useAdminDashboard;
