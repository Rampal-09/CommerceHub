import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Calendar, Loader2, Save } from "lucide-react";

/**
 * Profile Edit Form using React Hook Form
 */
export const ProfileForm = ({ profile, onSave, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "Prefer not to say",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (profile) {
      const formattedDob = profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().slice(0, 10)
        : "";

      reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "Prefer not to say",
        dateOfBirth: formattedDob,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    await onSave({
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name *
          </label>
          <input
            type="text"
            {...register("name", {
              required: "Full Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
            })}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-[11px] font-bold text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email (Read Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address (Read Only)
          </label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold cursor-not-allowed select-none"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Number
          </label>
          <input
            type="tel"
            {...register("phone", {
              pattern: {
                value: /^[0-9+\s\-()]{7,15}$/,
                message: "Please enter a valid phone number",
              },
            })}
            placeholder="+1 234 567 8900"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.phone && (
            <p className="text-[11px] font-bold text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date of Birth
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? "Saving..." : "Save Profile Changes"}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
