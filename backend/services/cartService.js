import Cart, { calculateCartTotals } from "../modals/cartSchema.js";
import Product from "../modals/productSchema.js";

/**
 * Standard fields to populate from Product model for cart response
 */
const POPULATE_PRODUCT_FIELDS = "title slug thumbnail price discountPrice stock isActive";

/**
 * Helper to populate product details in cart
 * @param {Object} cartQuery - Mongoose document or query
 */
const populateCartProduct = async (cart) => {
  return await cart.populate({
    path: "items.product",
    select: POPULATE_PRODUCT_FIELDS,
  });
};

/**
 * Get user cart by User ID
 * @param {string} userId
 */
export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart for user if none exists
    cart = await Cart.create({
      user: userId,
      items: [],
      subtotal: 0,
      total: 0,
    });
  }

  await populateCartProduct(cart);
  return cart;
};

/**
 * Add a product to user cart
 * @param {string} userId
 * @param {string} productId
 * @param {number} quantity
 */
export const addItemToCartService = async (userId, productId, quantity) => {
  const parsedQuantity = Number(quantity);

  // 1. Validate Product Existence & Active Status
  const product = await Product.findById(productId);
  if (!product) {
    throw { statusCode: 404, message: "Product not found" };
  }

  if (product.isActive === false) {
    throw { statusCode: 400, message: "Product inactive" };
  }

  // 2. Calculate current selling price of product
  const sellingPrice =
    product.discountPrice !== undefined &&
    product.discountPrice !== null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  // 3. Find or create Cart for User
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      subtotal: 0,
      total: 0,
    });
  }

  // 4. Check if product already exists in cart items
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Product already in cart: Increase quantity
    const newQuantity = cart.items[existingItemIndex].quantity + parsedQuantity;

    // Validate available stock against total requested quantity
    if (newQuantity > product.stock) {
      throw { statusCode: 400, message: "Quantity exceeds stock" };
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price = sellingPrice;
  } else {
    // New Product: Check stock
    if (parsedQuantity > product.stock) {
      throw { statusCode: 400, message: "Quantity exceeds stock" };
    }

    cart.items.push({
      product: productId,
      quantity: parsedQuantity,
      price: sellingPrice,
    });
  }

  // 5. Recalculate Totals & Save
  const totals = calculateCartTotals(cart);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  await populateCartProduct(cart);

  return cart;
};

/**
 * Update quantity of a product in user cart
 * @param {string} userId
 * @param {string} productId
 * @param {number} quantity
 */
export const updateCartItemQuantityService = async (userId, productId, quantity) => {
  const parsedQuantity = Number(quantity);

  if (parsedQuantity < 1) {
    throw { statusCode: 400, message: "Invalid quantity" };
  }

  // 1. Find Cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { statusCode: 404, message: "Cart not found" };
  }

  // 2. Find Item in Cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (itemIndex === -1) {
    throw { statusCode: 404, message: "Product not found in cart" };
  }

  // 3. Find Product in DB & Validate Active status & Stock
  const product = await Product.findById(productId);
  if (!product) {
    throw { statusCode: 404, message: "Product not found" };
  }

  if (product.isActive === false) {
    throw { statusCode: 400, message: "Product inactive" };
  }

  if (parsedQuantity > product.stock) {
    throw { statusCode: 400, message: "Quantity exceeds stock" };
  }

  // 4. Update Price & Quantity
  const sellingPrice =
    product.discountPrice !== undefined &&
    product.discountPrice !== null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  cart.items[itemIndex].quantity = parsedQuantity;
  cart.items[itemIndex].price = sellingPrice;

  // 5. Recalculate Totals & Save
  const totals = calculateCartTotals(cart);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  await populateCartProduct(cart);

  return cart;
};

/**
 * Remove single item from cart
 * @param {string} userId
 * @param {string} productId
 */
export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { statusCode: 404, message: "Cart not found" };
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  if (cart.items.length === initialLength) {
    throw { statusCode: 404, message: "Product not found in cart" };
  }

  const totals = calculateCartTotals(cart);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  await populateCartProduct(cart);

  return cart;
};

/**
 * Clear entire cart for user
 * @param {string} userId
 */
export const clearCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { statusCode: 404, message: "Cart not found" };
  }

  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;

  await cart.save();
  return cart;
};

export default {
  getCartService,
  addItemToCartService,
  updateCartItemQuantityService,
  removeCartItemService,
  clearCartService,
};
