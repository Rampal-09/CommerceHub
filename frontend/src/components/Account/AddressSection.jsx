import React from "react";
import AddressPage from "../../features/address/pages/AddressPage";

/**
 * Reusable Address Section wrapper for Account page
 */
export const AddressSection = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
      <AddressPage />
    </div>
  );
};

export default AddressSection;
