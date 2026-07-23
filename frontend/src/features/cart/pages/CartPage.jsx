import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";

/**
 * Skeleton Loader Component for Cart Page
 */
const CartSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items Skeleton List */}
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-3xl border border-slate-200/80 p-6 flex gap-4">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
              <div className="h-8 bg-slate-100 rounded-xl w-1/2 mt-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Sidebar Skeleton */}
      <div className="h-80 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
        <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
        </div>
        <div className="h-12 bg-indigo-200 rounded-2xl mt-6"></div>
      </div>
    </div>
  </div>
);

/**
 * Cart Page Component
 */
export const CartPage = () => {
  const {
    cart,
    loading,
    actionLoading,
    itemActionId,
    updateQuantity,
    removeItem,
    clearCart,
    cartItemsCount,
  } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 font-sans">
        {/* Banner */}
        <div className="bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-8 bg-slate-200 rounded-md w-64 animate-pulse"></div>
          </div>
        </div>
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Shopping Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-indigo-600" /> Shopping Cart
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Review your items and proceed to checkout when ready.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Page Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2 pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Cart Items ({items.length})
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item) => {
                  const pId = item.product?._id || item.product?.id || item.product;
                  const isItemUpdating = actionLoading && itemActionId === pId;

                  return (
                    <CartItem
                      key={pId || item._id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      isUpdating={isItemUpdating}
                      isRemoving={isItemUpdating}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                total={total}
                itemCount={cartItemsCount}
                onClearCart={clearCart}
                isClearing={actionLoading && !itemActionId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
