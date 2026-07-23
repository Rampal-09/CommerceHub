import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import {
  getAddresses as getAddressesApi,
  createAddress as createAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  setDefaultAddress as setDefaultAddressApi,
} from "../api/addressApi";

export const AddressContext = createContext(null);

export const AddressProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to extract address array from response
  const extractAddressesData = (res) => {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  };

  // Fetch addresses
  const fetchAddresses = useCallback(async (showSkeleton = true) => {
    if (!isAuthenticated) {
      setAddresses([]);
      setSelectedAddress(null);
      setLoading(false);
      return;
    }

    try {
      if (showSkeleton) setLoading(true);
      setError(null);
      const res = await getAddressesApi();
      const list = extractAddressesData(res);
      setAddresses(list);

      // Auto-set selectedAddress to default address or first address if not already set
      if (list.length > 0) {
        setSelectedAddress((prev) => {
          if (prev) {
            const exists = list.find((a) => a._id === prev._id);
            if (exists) return exists;
          }
          const defaultAddr = list.find((a) => a.isDefault);
          return defaultAddr || list[0];
        });
      } else {
        setSelectedAddress(null);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      if (err.response?.status !== 401) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load addresses.";
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses(true);
  }, [fetchAddresses]);

  // Select an address manually (e.g. during Checkout)
  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  // Add Address
  const addAddress = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add an address.");
      return false;
    }

    try {
      setActionLoading(true);
      const res = await createAddressApi(data);
      toast.success(res.message || "Address added successfully!");
      await fetchAddresses(false);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to add address.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Address
  const editAddress = async (id, data) => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      const res = await updateAddressApi(id, data);
      toast.success(res.message || "Address updated successfully!");
      await fetchAddresses(false);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update address.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Set Default Address
  const setDefault = async (id) => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      const res = await setDefaultAddressApi(id);
      toast.success(res.message || "Default address updated!");
      await fetchAddresses(false);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to set default address.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Address
  const removeAddress = async (id) => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      const res = await deleteAddressApi(id);
      toast.success(res.message || "Address deleted successfully!");
      await fetchAddresses(false);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete address.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const value = {
    addresses,
    selectedAddress,
    loading,
    actionLoading,
    error,
    fetchAddresses,
    addAddress,
    editAddress,
    setDefault,
    removeAddress,
    selectAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export default AddressContext;
