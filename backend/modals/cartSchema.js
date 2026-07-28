import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User reference is required"],
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Subtotal cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Helper function to calculate cart subtotal and total
 * @param {Object} cart - Mongoose cart document or object
 * @returns {Object} { subtotal, total }
 */
export const calculateCartTotals = (cart) => {
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return { subtotal: 0, total: 0 };
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    return sum + itemPrice * itemQty;
  }, 0);

  // Total equals subtotal (no discount / tax yet as per prompt requirements)
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const roundedTotal = roundedSubtotal;

  return { subtotal: roundedSubtotal, total: roundedTotal };
};

/**
 * Pre-save middleware hook to automatically calculate subtotal and total before saving
 */
cartSchema.pre("save", function () {
  const { subtotal, total } = calculateCartTotals(this);
  this.subtotal = subtotal;
  this.total = total;
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
