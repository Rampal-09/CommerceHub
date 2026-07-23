import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import { useCart } from "../../cart/hooks/useCart";
import {
  getWishlist as getWishlistApi,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  clearWishlist as clearWishlistApi,
} from "../api/wishlistApi";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [itemActionId, setItemActionId] = useState(null);
  const [error, setError] = useState(null);

  // Helper to extract wishlist object from API response
  const extractWishlistData = (res) => {
    if (!res) return { products: [] };
    if (res.data) return res.data;
    if (res.products) return res;
    return { products: [] };
  };

  // Fetch wishlist
  const fetchWishlist = useCallback(async (showSkeleton = true) => {
    if (!isAuthenticated) {
      setWishlist({ products: [] });
      setLoading(false);
      return;
    }

    try {
      if (showSkeleton) setLoading(true);
      setError(null);
      const res = await getWishlistApi();
      const wishlistData = extractWishlistData(res);
      setWishlist(wishlistData);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      if (err.response?.status !== 401) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load wishlist.";
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist(true);
  }, [fetchWishlist]);

  // Check if a product is in wishlist
  const isWishlisted = useCallback(
    (productId) => {
      if (!productId || !wishlist || !Array.isArray(wishlist.products)) return false;
      return wishlist.products.some((item) => {
        const pId = item.product?._id || item.product?.id || item.product;
        return pId?.toString() === productId?.toString();
      });
    },
    [wishlist]
  );

  // Add Product to Wishlist (Optimistic)
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wishlist.");
      return false;
    }

    if (isWishlisted(productId)) {
      toast.error("Product already in wishlist.");
      return false;
    }

    try {
      setActionLoading(true);
      setItemActionId(productId);
      const res = await addToWishlistApi(productId);
      const updatedData = extractWishlistData(res);
      setWishlist(updatedData);
      toast.success(res.message || "Product added to wishlist!");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not add product to wishlist.";
      toast.error(errMsg);
      await fetchWishlist(false);
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  // Remove Product from Wishlist (Optimistic)
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    // Optimistic state update
    setWishlist((prev) => ({
      ...prev,
      products: (prev.products || []).filter((item) => {
        const pId = item.product?._id || item.product?.id || item.product;
        return pId?.toString() !== productId?.toString();
      }),
    }));

    try {
      setActionLoading(true);
      setItemActionId(productId);
      const res = await removeFromWishlistApi(productId);
      const updatedData = extractWishlistData(res);
      setWishlist(updatedData);
      toast.success(res.message || "Product removed from wishlist.");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not remove product from wishlist.";
      toast.error(errMsg);
      await fetchWishlist(false);
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      const res = await clearWishlistApi();
      setWishlist({ products: [] });
      toast.success(res.message || "Wishlist cleared successfully.");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not clear wishlist.";
      toast.error(errMsg);
      await fetchWishlist(false);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Move to Cart (Adds to Cart & Removes from Wishlist)
  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your cart.");
      return false;
    }

    try {
      setActionLoading(true);
      setItemActionId(productId);

      // 1. Add to Cart
      const cartSuccess = await addToCart(productId, 1);
      if (cartSuccess) {
        // 2. Remove from Wishlist
        await removeFromWishlist(productId);
        toast.success("Moved product to cart!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Move to cart error:", err);
      toast.error("Could not move product to cart.");
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  const wishlistCount = useMemo(() => {
    if (!wishlist || !Array.isArray(wishlist.products)) return 0;
    return wishlist.products.length;
  }, [wishlist]);

  const value = {
    wishlist,
    wishlistCount,
    loading,
    actionLoading,
    itemActionId,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isWishlisted,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
