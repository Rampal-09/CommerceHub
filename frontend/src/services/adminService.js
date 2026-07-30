import api from "../api/auth";

/**
 * Fetch aggregated admin dashboard statistics
 */
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

/**
 * Fetch all platform orders with optional filtering & pagination
 */
export const getAllOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", { params });
  return response.data;
};

/**
 * Update order status by admin
 */
export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await api.patch(`/admin/orders/${orderId}`, {
    orderStatus,
  });
  return response.data;
};
