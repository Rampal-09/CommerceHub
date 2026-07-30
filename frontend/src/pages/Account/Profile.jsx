import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import AvatarUploader from "../../components/Account/AvatarUploader";
import ProfileCard from "../../components/Account/ProfileCard";
import ProfileForm from "../../components/Account/ProfileForm";
import LoadingSkeleton from "../../components/Account/LoadingSkeleton";
import { User, X } from "lucide-react";

/**
 * Account Profile Management Page
 */
export const Profile = () => {
  const {
    profile,
    loading,
    actionLoading,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (formData) => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <AvatarUploader
        currentAvatar={profile?.avatar}
        name={profile?.name || "User"}
        onUpload={uploadAvatar}
        onRemove={removeAvatar}
        isLoading={actionLoading}
      />

      {/* Profile Info Form / Display Card */}
      {isEditing ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Edit Profile Information
            </h3>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          <ProfileForm
            profile={profile}
            onSave={handleSave}
            isLoading={actionLoading}
          />
        </div>
      ) : (
        <ProfileCard profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default Profile;
