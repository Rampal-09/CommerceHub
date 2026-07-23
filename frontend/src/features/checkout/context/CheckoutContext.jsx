import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import { getCheckout as getCheckoutApi, placeOrder as placeOrderApi } from "../api/checkoutApi";

export const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [checkoutData, setCheckoutData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [priceSummary, setPriceSummary] = useState({
    subtotal: 0,
    discount: 0,
    shippingFee: 0,
    tax: 0,
    grandTotal: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pre-checkout data from server
  const fetchCheckout = useCallback(async (addressId = null, showSkeleton = true) => {
    if (!isAuthenticated) {
      setCheckoutData(null);
      setCartItems([]);
      setAddresses([]);
      setSelectedAddress(null);
      setLoading(false);
      return;
    }

    try {
      if (showSkeleton) setLoading(true);
      setError(null);
      const res = await getCheckoutApi(addressId);
      const data = res.data || res;

      setCheckoutData(data);
      const items = data.cart?.items || [];
      setCartItems(items);

      const addrList = data.addresses || [];
      setAddresses(addrList);

      const selAddr = data.selectedAddress || (addrList.length > 0 ? addrList[0] : null);
      setSelectedAddress(selAddr);

      if (data.pricing) {
        setPriceSummary(data.pricing);
      }
    } catch (err) {
      console.error("Fetch checkout error:", err);
      if (err.response?.status !== 401) {
        const errMsg = err.response?.data?.message || err.message || "Failed to load checkout details.";
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCheckout(null, true);
  }, [fetchCheckout]);

  // Select shipping address & update pricing summary if needed
  const selectShippingAddress = async (address) => {
    setSelectedAddress(address);
    if (address?._id) {
      await fetchCheckout(address._id, false);
    }
  };

  // Apply Coupon (Bonus Feature)
  const applyCoupon = (code) => {
    if (!code || !code.trim()) {
      toast.error("Please enter a coupon code.");
      return false;
    }

    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode === "WELCOME10" || trimmedCode === "SAVE10") {
      const disc = Math.round(priceSummary.subtotal * 0.1 * 100) / 100;
      setCouponCode(trimmedCode);
      setAppliedDiscount(disc);
      toast.success(`Coupon "${trimmedCode}" applied! Saved $${disc}`);
      return true;
    } else {
      toast.error("Invalid coupon code. Try 'WELCOME10' for 10% off.");
      return false;
    }
  };

  // Calculate final grand total including coupon discount
  const finalGrandTotal = Math.max(0, (priceSummary.grandTotal || 0) - appliedDiscount);

  // Place Order Action
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to place an order.");
      return null;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before checking out.");
      return null;
    }

    if (!selectedAddress || !selectedAddress._id) {
      toast.error("Please select a valid shipping address.");
      return null;
    }

    try {
      setPlacingOrder(true);
      const payload = {
        shippingAddressId: selectedAddress._id,
        paymentMethod: paymentMethod || "COD",
        orderNotes,
      };

      const res = await placeOrderApi(payload);
      const order = res.data || res;

      toast.success(res.message || "Order placed successfully!");
      return order;
    } catch (err) {
      console.error("Place order error:", err);
      const errMsg = err.response?.data?.message || err.message || "Could not place order. Please try again.";
      toast.error(errMsg);
      return null;
    } finally {
      setPlacingOrder(false);
    }
  };

  const value = {
    checkoutData,
    cartItems,
    addresses,
    selectedAddress,
    priceSummary: {
      ...priceSummary,
      discount: (priceSummary.discount || 0) + appliedDiscount,
      grandTotal: finalGrandTotal,
    },
    paymentMethod,
    orderNotes,
    couponCode,
    appliedDiscount,
    loading,
    placingOrder,
    error,
    fetchCheckout,
    selectShippingAddress,
    setPaymentMethod,
    setOrderNotes,
    applyCoupon,
    placeOrder: handlePlaceOrder,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export default CheckoutContext;
