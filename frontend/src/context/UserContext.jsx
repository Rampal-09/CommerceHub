import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./authContext";
import {
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
  uploadAvatar as uploadAvatarApi,
  removeAvatar as removeAvatarApi,
  changePassword as changePasswordApi,
  getOrders as getOrdersApi,
  getOrderById as getOrderByIdApi,
  getDashboardStats as getDashboardStatsApi,
} from "../services/profileService";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isAuthenticated, user: authUser } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    totalAmountSpent: 0,
    recentOrders: [],
  });
  const [ordersData, setOrdersData] = useState({
    orders: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalOrders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to extract data from standard API response wrapper
  const extractData = (res) => (res && res.data ? res.data : res);

  // Fetch User Profile
  const fetchProfile = useCallback(async (showSkeleton = true) => {
    if (!isAuthenticated) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      if (showSkeleton) setLoading(true);
      setError(null);
      const res = await getProfileApi();
      const profile = extractData(res);
      setUserProfile(profile);
    } catch (err) {
      console.error("Fetch profile error:", err);
      if (err.response?.status !== 401) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load user profile.";
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Dashboard Stats
  const fetchDashboardStats = useCallback(async (showSkeleton = false) => {
    if (!isAuthenticated) return;
    try {
      if (showSkeleton) setLoading(true);
      const res = await getDashboardStatsApi();
      const stats = extractData(res);
      setDashboardStats(stats || { totalOrders: 0, wishlistCount: 0, totalAmountSpent: 0, recentOrders: [] });
    } catch (err) {
      console.error("Fetch dashboard stats error:", err);
    } finally {
      if (showSkeleton) setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Orders List
  const fetchOrders = useCallback(async (page = 1, limit = 10, showSkeleton = true) => {
    if (!isAuthenticated) return;
    try {
      if (showSkeleton) setLoading(true);
      const res = await getOrdersApi(page, limit);
      const data = extractData(res);
      setOrdersData(data || { orders: [], page: 1, totalPages: 1, totalOrders: 0 });
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error(err.response?.data?.message || "Failed to load orders history.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Single Order Details
  const fetchOrderById = useCallback(async (orderId) => {
    if (!isAuthenticated || !orderId) return null;
    try {
      setLoading(true);
      setSelectedOrder(null);
      const res = await getOrderByIdApi(orderId);
      const order = extractData(res);
      setSelectedOrder(order);
      return order;
    } catch (err) {
      console.error("Fetch order by ID error:", err);
      toast.error(err.response?.data?.message || "Could not fetch order details.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile(true);
  }, [fetchProfile]);

  // Update Profile Details
  const handleUpdateProfile = async (payload) => {
    try {
      setActionLoading(true);
      const res = await updateProfileApi(payload);
      const updatedProfile = extractData(res);
      setUserProfile(updatedProfile);
      toast.success(res.message || "Profile information updated!");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Upload Profile Avatar
  const handleUploadAvatar = async (file) => {
    if (!file) return false;
    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadAvatarApi(formData);
      const updatedProfile = extractData(res);
      setUserProfile(updatedProfile);
      toast.success(res.message || "Profile avatar updated successfully!");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to upload avatar.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Profile Avatar
  const handleRemoveAvatar = async () => {
    try {
      setActionLoading(true);
      const res = await removeAvatarApi();
      const updatedProfile = extractData(res);
      setUserProfile(updatedProfile);
      toast.success(res.message || "Profile avatar removed.");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to remove avatar.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (payload) => {
    try {
      setActionLoading(true);
      const res = await changePasswordApi(payload);
      toast.success(res.message || "Password changed successfully!");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to change password.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const value = {
    userProfile: userProfile || authUser,
    dashboardStats,
    ordersData,
    selectedOrder,
    loading,
    actionLoading,
    error,
    fetchProfile,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    removeAvatar: handleRemoveAvatar,
    changePassword: handleChangePassword,
    fetchOrders,
    fetchOrderById,
    fetchDashboardStats,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
