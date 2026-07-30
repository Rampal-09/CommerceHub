import React from "react";
import { User, Mail, Phone, Calendar, Edit3, ShieldCheck } from "lucide-react";

/**
 * Profile Read-Only Display Card Component
 */
export const ProfileCard = ({ profile, onEdit }) => {
  const {
    name = "User",
    email = "",
    phone = "Not provided",
    gender = "Prefer not to say",
    dateOfBirth,
    avatar,
  } = profile || {};

  const formattedDob = dateOfBirth
    ? new Date(dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not provided";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" /> Profile Information
        </h3>

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Full Name */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
          <span className="font-extrabold text-slate-900 text-sm block">{name}</span>
        </div>

        {/* Email */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
          <span className="font-extrabold text-slate-900 text-sm block">{email}</span>
        </div>

        {/* Phone */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Phone Number</span>
          <span className="font-extrabold text-slate-900 text-sm block">{phone || "Not provided"}</span>
        </div>

        {/* Gender */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Gender</span>
          <span className="font-extrabold text-slate-900 text-sm block">{gender}</span>
        </div>

        {/* Date of Birth */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1 sm:col-span-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider block">Date of Birth</span>
          <span className="font-extrabold text-slate-900 text-sm block">{formattedDob}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
