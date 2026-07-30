import { useState, useEffect, useCallback } from "react";
import { getAllOrders, updateOrderStatus as updateOrderStatusApi } from "../services/adminService";
import toast from "react-hot-toast";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await getAllOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
        setPagination({
          currentPage: res.pagination?.currentPage || 1,
          totalPages: res.pagination?.totalPages || 1,
          totalOrders: res.pagination?.totalOrders || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
      toast.error("Failed to load order list.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, statusFilter, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setSubmitting(true);
      const res = await updateOrderStatusApi(orderId, newStatus);
      if (res.success) {
        toast.success(res.message || "Order status updated.");
        // Local state update for instant UI feedback
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        return { success: true };
      }
    } catch (err) {
      console.error("Update order status error:", err);
      const msg = err.response?.data?.message || "Failed to update order status.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    orders,
    loading,
    submitting,
    statusFilter,
    searchTerm,
    currentPage,
    pagination,
    setStatusFilter: (status) => {
      setStatusFilter(status);
      setCurrentPage(1);
    },
    setSearchTerm: (term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    },
    handlePageChange,
    updateStatus,
    refreshOrders: fetchOrders,
  };
};

export default useAdminOrders;
