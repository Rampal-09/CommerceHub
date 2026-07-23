import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";

/**
 * Change Password Form Component using React Hook Form & Strength Indicator
 */
export const PasswordForm = ({ onSubmitPassword, isLoading = false }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword", "");

  // Strength check calculations
  const hasMinLength = newPasswordValue.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[^a-zA-Z0-9]/.test(newPasswordValue);

  const strengthScore = [hasMinLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPasswordValue) return { label: "", color: "" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-red-500" };
    if (strengthScore === 2 || strengthScore === 3) return { label: "Medium", color: "bg-amber-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  };

  const strengthInfo = getStrengthLabel();

  const handleFormSubmit = async (data) => {
    const success = await onSubmitPassword(data);
    if (success) {
      reset();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-600" /> Change Account Password
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Ensure your account is using a strong, unique password to stay protected.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 max-w-lg">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[11px] font-bold text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "New password must be at least 6 characters" },
                validate: {
                  hasLetterAndNumber: (val) =>
                    (/[a-zA-Z]/.test(val) && /[0-9]/.test(val)) ||
                    "Password must contain both letters and numbers",
                },
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[11px] font-bold text-red-600">{errors.newPassword.message}</p>
          )}

          {/* Password Strength Progress Indicator */}
          {newPasswordValue && (
            <div className="pt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>Password Strength:</span>
                <span className="capitalize">{strengthInfo.label}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${strengthInfo.color} transition-all duration-300`}
                  style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (val) =>
                  val === newPasswordValue || "Confirm password does not match new password",
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-bold text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isLoading ? "Updating Password..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
