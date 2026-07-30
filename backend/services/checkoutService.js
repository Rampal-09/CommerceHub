import Order from "../modals/orderSchema.js";
import Cart from "../modals/cartSchema.js";
import Address from "../modals/addressSchema.js";
import Product from "../modals/productSchema.js";

/**
 * Generate a unique readable Order Number
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
};

/**
 * Get Checkout Summary
 * Calculates cart totals, addresses, default address, and pricing on server
 * @param {string} userId
 * @param {string} [addressId=null]
 */
export const getCheckoutSummaryService = async (userId, addressId = null) => {
  // 1. Fetch Cart for User with populated product details
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "title slug thumbnail price discountPrice stock isActive",
  });

  if (!cart) {
    cart = { items: [], subtotal: 0, total: 0 };
  }

  // 2. Fetch User Addresses
  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  // 3. Resolve Selected Address
  let selectedAddress = null;
  if (addressId) {
    selectedAddress = addresses.find((a) => a._id.toString() === addressId.toString()) || null;
  }
  if (!selectedAddress && addresses.length > 0) {
    selectedAddress = addresses.find((a) => a.isDefault) || addresses[0];
  }

  // 4. Server-side Pricing Calculations
  let subtotal = 0;
  if (cart.items && Array.isArray(cart.items)) {
    subtotal = cart.items.reduce((sum, item) => {
      const prod = item.product;
      if (!prod) return sum;

      const sellingPrice =
        prod.discountPrice !== undefined &&
        prod.discountPrice !== null &&
        prod.discountPrice > 0 &&
        prod.discountPrice < prod.price
          ? prod.discountPrice
          : prod.price;

      return sum + sellingPrice * (item.quantity || 1);
    }, 0);
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const discount = 0;
  const shippingFee = subtotal >= 50 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const grandTotal = Math.round((subtotal - discount + shippingFee + tax) * 100) / 100;

  return {
    cart,
    addresses,
    selectedAddress,
    pricing: {
      subtotal,
      discount,
      shippingFee,
      tax,
      grandTotal,
    },
  };
};

/**
 * Place Order from Shopping Cart
 * Performs atomic stock validation, server-side price calculation, stock decrementing, and cart reset
 * @param {string} userId
 * @param {Object} payload - { shippingAddressId, paymentMethod }
 */
export const placeOrderService = async (userId, { shippingAddressId, paymentMethod = "COD" }) => {
  // 1. Fetch Cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw { statusCode: 400, message: "Your shopping cart is empty." };
  }

  // 2. Fetch & Validate Shipping Address
  const address = await Address.findOne({ _id: shippingAddressId, user: userId });
  if (!address) {
    throw { statusCode: 404, message: "Selected shipping address was not found." };
  }

  // 3. Process Cart Items, Validate Stock & Active Status
  const orderItems = [];
  let calculatedSubtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw { statusCode: 404, message: `Product reference "${item.product}" no longer exists.` };
    }

    if (product.isActive === false) {
      throw {
        statusCode: 400,
        message: `Product "${product.title}" is currently inactive and cannot be purchased.`,
      };
    }

    if (item.quantity > product.stock) {
      throw {
        statusCode: 400,
        message: `Insufficient stock for product "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}.`,
      };
    }

    // Determine current selling price on server
    const sellingPrice =
      product.discountPrice !== undefined &&
      product.discountPrice !== null &&
      product.discountPrice > 0 &&
      product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const itemTotal = sellingPrice * item.quantity;
    calculatedSubtotal += itemTotal;

    const thumbnailUrl =
      product.thumbnail?.url ||
      (typeof product.thumbnail === "string" ? product.thumbnail : "") ||
      (product.images && product.images[0]?.url) ||
      "";

    orderItems.push({
      product: product._id,
      title: product.title,
      slug: product.slug || "",
      thumbnail: thumbnailUrl,
      price: sellingPrice,
      quantity: item.quantity,
    });
  }

  // 4. Calculate Final Server-Side Pricing
  const subtotal = Math.round(calculatedSubtotal * 100) / 100;
  const discount = 0;
  const shippingFee = subtotal >= 50 ? 0 : 10;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal - discount + shippingFee + tax) * 100) / 100;

  // 5. Generate Order Number & Create Order Document
  const orderNumber = generateOrderNumber();

  const newOrder = new Order({
    orderNumber,
    user: userId,
    orderItems,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      alternatePhone: address.alternatePhone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType || "Home",
    },
    subtotal,
    discount,
    shippingFee,
    tax,
    grandTotal,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
    orderStatus: "Placed",
  });

  await newOrder.save();

  // 6. Deduct Product Stock & Increment Sold Count
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
        soldCount: item.quantity,
      },
    });
  }

  // 7. Reset User's Shopping Cart
  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;
  await cart.save();

  return newOrder;
};

export default {
  getCheckoutSummaryService,
  placeOrderService,
};
