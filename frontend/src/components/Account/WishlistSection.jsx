import React from "react";
import WishlistPage from "../../features/wishlist/pages/WishlistPage";

/**
 * Reusable Wishlist Section wrapper for Account page
 */
export const WishlistSection = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
      <WishlistPage />
    </div>
  );
};

export default WishlistSection;
