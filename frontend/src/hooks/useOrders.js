import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Custom hook to manage user orders state & actions
 */
export const useOrders = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useOrders must be used within a UserProvider");
  }

  const {
    ordersData,
    selectedOrder,
    loading,
    actionLoading,
    fetchOrders,
    fetchOrderById,
  } = context;

  return {
    orders: ordersData.orders || [],
    page: ordersData.page || 1,
    limit: ordersData.limit || 10,
    totalPages: ordersData.totalPages || 1,
    totalOrders: ordersData.totalOrders || 0,
    selectedOrder,
    loading,
    actionLoading,
    fetchOrders,
    fetchOrderById,
  };
};

export default useOrders;
