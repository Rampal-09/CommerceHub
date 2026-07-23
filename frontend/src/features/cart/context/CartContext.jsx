import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import {
  getCart as getCartApi,
  addToCart as addToCartApi,
  updateQuantity as updateQuantityApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from "../api/cartApi";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [itemActionId, setItemActionId] = useState(null); // Tracks specific item ID during mutation
  const [error, setError] = useState(null);

  // Helper to extract cart object from API response
  const extractCartData = (res) => {
    if (!res) return { items: [], subtotal: 0, total: 0 };
    if (res.data) return res.data;
    if (res.items) return res;
    return { items: [], subtotal: 0, total: 0 };
  };

  // Fetch cart data from API
  const fetchCart = useCallback(async (showSkeleton = true) => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, total: 0 });
      setLoading(false);
      return;
    }

    try {
      if (showSkeleton) setLoading(true);
      setError(null);
      const res = await getCartApi();
      const cartData = extractCartData(res);
      setCart(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
      // If 401 unauthenticated, reset cart quietly
      if (err.response?.status === 401) {
        setCart({ items: [], subtotal: 0, total: 0 });
      } else {
        const errMsg = err.response?.data?.message || err.message || "Failed to load cart.";
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh cart without full skeleton spinner
  const refreshCart = useCallback(async () => {
    return await fetchCart(false);
  }, [fetchCart]);

  useEffect(() => {
    fetchCart(true);
  }, [fetchCart, user]);

  // Add Item to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      return false;
    }

    try {
      setActionLoading(true);
      setItemActionId(productId);
      const res = await addToCartApi(productId, quantity);
      const updatedCart = extractCartData(res);
      setCart(updatedCart);
      toast.success(res.message || "Product added to cart!");
      await refreshCart();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not add product to cart.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  // Update Quantity of Item
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage cart.");
      return false;
    }

    try {
      setActionLoading(true);
      setItemActionId(productId);
      const res = await updateQuantityApi(productId, quantity);
      const updatedCart = extractCartData(res);
      setCart(updatedCart);
      await refreshCart();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not update item quantity.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  // Remove Item from Cart
  const removeItem = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      setItemActionId(productId);
      const res = await removeCartItemApi(productId);
      const updatedCart = extractCartData(res);
      setCart(updatedCart);
      toast.success(res.message || "Item removed from cart.");
      await refreshCart();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not remove item from cart.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
      setItemActionId(null);
    }
  };

  // Clear Entire Cart
  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      setActionLoading(true);
      const res = await clearCartApi();
      setCart({ items: [], subtotal: 0, total: 0 });
      toast.success(res.message || "Cart cleared successfully.");
      await refreshCart();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Could not clear cart.";
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate total count of items in cart
  const cartItemsCount = useMemo(() => {
    if (!cart || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  }, [cart]);

  const value = {
    cart,
    loading,
    actionLoading,
    itemActionId,
    error,
    cartItemsCount,
    fetchCart,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
