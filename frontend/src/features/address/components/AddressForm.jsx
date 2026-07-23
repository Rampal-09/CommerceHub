import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Home, Briefcase, MapPin, Loader2, X } from "lucide-react";

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/**
 * Reusable Address Form Component using React Hook Form
 */
export const AddressForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      alternatePhone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "Maharashtra",
      country: "India",
      postalCode: "",
      addressType: "Home",
      isDefault: false,
    },
  });

  const currentAddressType = watch("addressType");

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        alternatePhone: initialData.alternatePhone || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        landmark: initialData.landmark || "",
        city: initialData.city || "",
        state: initialData.state || "Maharashtra",
        country: initialData.country || "India",
        postalCode: initialData.postalCode || "",
        addressType: initialData.addressType || "Home",
        isDefault: initialData.isDefault || false,
      });
    } else {
      reset({
        fullName: "",
        phone: "",
        alternatePhone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "Maharashtra",
        country: "India",
        postalCode: "",
        addressType: "Home",
        isDefault: false,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            {isEditMode ? "Edit Delivery Address" : "Add New Delivery Address"}
          </h3>
          <p className="text-xs text-slate-500">
            Please enter your correct address details for seamless delivery.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Address Type Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Address Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "Home", label: "Home", icon: Home },
            { id: "Work", label: "Work", icon: Briefcase },
            { id: "Other", label: "Other", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setValue("addressType", id)}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentAddressType === id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Info (Full Name & Phones) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("fullName", {
              required: "Full name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.fullName ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {errors.fullName && (
            <span className="text-[11px] font-semibold text-red-500">{errors.fullName.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]{7,15}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.phone ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {errors.phone && (
            <span className="text-[11px] font-semibold text-red-500">{errors.phone.message}</span>
          )}
        </div>
      </div>

      {/* Alternate Phone */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Alternate Phone <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="tel"
          placeholder="Secondary contact number"
          {...register("alternatePhone", {
            pattern: {
              value: /^[0-9+\-\s()]{7,15}$/,
              message: "Enter a valid phone number",
            },
          })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        {errors.alternatePhone && (
          <span className="text-[11px] font-semibold text-red-500">{errors.alternatePhone.message}</span>
        )}
      </div>

      {/* Address Line 1 & Line 2 */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Address Line 1 (Flat, Building, Street) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Flat 402, Sunshine Apartments, MG Road"
            {...register("addressLine1", {
              required: "Address Line 1 is required",
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.addressLine1 ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {errors.addressLine1 && (
            <span className="text-[11px] font-semibold text-red-500">{errors.addressLine1.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Address Line 2 <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Area / Sector / Colony"
              {...register("addressLine2")}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Landmark <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Near City Hospital"
              {...register("landmark")}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* City, State, Country & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            City / Town <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Mumbai"
            {...register("city", {
              required: "City is required",
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.city ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {errors.city && (
            <span className="text-[11px] font-semibold text-red-500">{errors.city.message}</span>
          )}
        </div>

        {/* State Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register("state", {
              required: "State is required",
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer ${
              errors.state ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.state && (
            <span className="text-[11px] font-semibold text-red-500">{errors.state.message}</span>
          )}
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="India"
            {...register("country", {
              required: "Country is required",
            })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Postal / PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="400001"
            {...register("postalCode", {
              required: "Postal code is required",
              pattern: {
                value: /^[0-9]{5,8}$/,
                message: "Enter a valid postal / PIN code",
              },
            })}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.postalCode ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {errors.postalCode && (
            <span className="text-[11px] font-semibold text-red-500">{errors.postalCode.message}</span>
          )}
        </div>
      </div>

      {/* Set as Default Checkbox */}
      <div className="pt-2">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-800">
            Make this my default delivery address
          </span>
        </label>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Address...</span>
            </>
          ) : (
            <span>{isEditMode ? "Update Address" : "Save Address"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
