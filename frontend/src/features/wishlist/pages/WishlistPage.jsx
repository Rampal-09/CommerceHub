import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronRight, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import WishlistItem from "../components/WishlistItem";
import EmptyWishlist from "../components/EmptyWishlist";

/**
 * Skeleton Loader Component for Wishlist Page
 */
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-96 bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4">
        <div className="w-full aspect-square bg-slate-200 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        </div>
        <div className="h-10 bg-indigo-100 rounded-xl mt-4"></div>
      </div>
    ))}
  </div>
);

/**
 * Wishlist Page Component
 */
export const WishlistPage = () => {
  const {
    wishlist,
    wishlistCount,
    loading,
    actionLoading,
    itemActionId,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
  } = useWishlist();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const products = wishlist?.products || [];

  const handleConfirmClear = async () => {
    setShowConfirmModal(false);
    await clearWishlist();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 font-sans">
        <div className="bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-8 bg-slate-200 rounded-md w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <WishlistSkeleton />
        </div>
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
            <span className="text-slate-800 font-bold">My Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Wishlist
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                You have {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved in your wishlist.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {wishlistCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Wishlist</span>
                </button>
              )}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {products.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => {
              const pId = item.product?._id || item.product?.id || item.product;
              const isItemLoading = actionLoading && itemActionId === pId;

              return (
                <WishlistItem
                  key={pId || item._id}
                  item={item}
                  onRemove={removeFromWishlist}
                  onMoveToCart={moveToCart}
                  isLoading={isItemLoading}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Wishlist Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Clear entire wishlist?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove all items from your wishlist? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Yes, Clear Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
