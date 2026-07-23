import api from "../../../api/auth";

/**
 * Fetch pre-checkout summary data (cart, addresses, selected address, server pricing)
 * @param {string} [addressId=null] - Optional selected address ID
 */
export const getCheckout = async (addressId = null) => {
  const params = addressId ? { addressId } : {};
  const response = await api.get("/checkout", { params });
  return response.data;
};

/**
 * Place order from current shopping cart and selected shipping address
 * @param {Object} payload - { shippingAddressId, paymentMethod }
 */
export const placeOrder = async (payload) => {
  const response = await api.post("/checkout/place-order", payload);
  return response.data;
};

export default {
  getCheckout,
  placeOrder,
};
