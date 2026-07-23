import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Check, Plus, Edit, ChevronDown, Home, Briefcase, Star, X } from "lucide-react";

/**
 * Address Selector Component for Checkout
 */
export const AddressSelector = ({
  selectedAddress,
  addresses = [],
  onSelectAddress,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case "Work":
        return Briefcase;
      case "Other":
        return MapPin;
      default:
        return Home;
    }
  };

  const handleSelect = (addr) => {
    onSelectAddress(addr);
    setShowModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" /> Shipping Address
        </h3>

        <div className="flex items-center gap-2">
          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{selectedAddress ? "Change" : "Select"}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            to="/addresses"
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage</span>
          </Link>
        </div>
      </div>

      {/* Selected Address Display */}
      {selectedAddress ? (
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 relative group">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">
                {selectedAddress.fullName}
              </span>

              {/* Type Badge */}
              {selectedAddress.addressType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                  {selectedAddress.addressType}
                </span>
              )}

              {/* Default Badge */}
              {selectedAddress.isDefault && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Default
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> {selectedAddress.phone}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}
            {selectedAddress.landmark ? `, Landmark: ${selectedAddress.landmark}` : ""},
            {" "}{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode},{" "}
            {selectedAddress.country}
          </p>
        </div>
      ) : (
        <div className="p-6 bg-red-50/60 rounded-2xl border border-red-200 text-center space-y-3">
          <p className="text-xs font-bold text-red-700">
            No shipping address selected! Please select or add an address to proceed.
          </p>
          <Link
            to="/addresses"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </Link>
        </div>
      )}

      {/* Address Selection Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Select Delivery Address</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?._id === addr._id;
                const Icon = getTypeIcon(addr.addressType);

                return (
                  <div
                    key={addr._id}
                    onClick={() => handleSelect(addr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-200"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{addr.fullName}</span>
                        <span className="px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-indigo-700 border border-indigo-100 flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {addr.addressType}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-amber-50 rounded-full text-[10px] font-bold text-amber-700 border border-amber-200">
                            Default
                          </span>
                        )}
                      </div>

                      {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">Phone: {addr.phone}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/addresses"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </Link>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
