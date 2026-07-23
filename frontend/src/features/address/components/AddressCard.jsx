import React, { useState } from "react";
import {
  Home,
  Briefcase,
  MapPin,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  AlertTriangle,
} from "lucide-react";

/**
 * Address Card Component
 */
export const AddressCard = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isActionLoading = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    _id,
    fullName,
    phone,
    alternatePhone,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    country,
    postalCode,
    addressType = "Home",
    isDefault = false,
  } = address;

  const getTypeIcon = () => {
    switch (addressType) {
      case "Work":
        return Briefcase;
      case "Other":
        return MapPin;
      default:
        return Home;
    }
  };

  const TypeIcon = getTypeIcon();

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    await onDelete(_id);
  };

  return (
    <div
      className={`p-6 rounded-3xl border transition-all relative flex flex-col justify-between h-full bg-white ${
        isSelected
          ? "border-indigo-600 ring-2 ring-indigo-200 shadow-md"
          : "border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300"
      }`}
    >
      <div className="space-y-4">
        {/* Top Badges Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Address Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
              <TypeIcon className="w-3.5 h-3.5" />
              <span>{addressType}</span>
            </span>

            {/* Default Badge */}
            {isDefault && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Default Address</span>
              </span>
            )}
          </div>

          {/* Checkout Select Button / Indicator */}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(address)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSelected ? "Selected" : "Select"}</span>
            </button>
          )}
        </div>

        {/* Full Name & Phone */}
        <div className="space-y-1">
          <h4 className="text-base font-black text-slate-900 leading-snug">{fullName}</h4>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> {phone}
            </span>
            {alternatePhone && (
              <span className="text-slate-400">
                | Alt: <span className="text-slate-600">{alternatePhone}</span>
              </span>
            )}
          </div>
        </div>

        {/* Complete Address Body */}
        <div className="text-xs text-slate-600 leading-relaxed space-y-0.5 pt-1 border-t border-slate-100">
          <p className="font-medium text-slate-800">{addressLine1}</p>
          {addressLine2 && <p>{addressLine2}</p>}
          {landmark && (
            <p className="italic text-slate-500">
              Landmark: <span className="not-italic text-slate-700">{landmark}</span>
            </p>
          )}
          <p className="font-semibold text-slate-800 pt-0.5">
            {city}, {state} - <span className="font-bold">{postalCode}</span>
          </p>
          <p className="text-slate-500">{country}</p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
        {/* Set as Default Link */}
        {!isDefault && onSetDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(_id)}
            disabled={isActionLoading}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer disabled:opacity-50"
          >
            Set as Default
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400">
            {isDefault ? "Primary Address" : ""}
          </span>
        )}

        <div className="flex items-center gap-2">
          {/* Edit Action */}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(address)}
              disabled={isActionLoading}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
              title="Edit Address"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Delete Action */}
          {onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={isActionLoading}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
              title="Delete Address"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Delete address?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
