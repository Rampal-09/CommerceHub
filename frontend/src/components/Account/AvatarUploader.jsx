import React, { useState, useRef } from "react";
import { Camera, Trash2, Upload, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Avatar Uploader Component with Live Preview & Validation
 */
export const AvatarUploader = ({
  currentAvatar,
  name = "User",
  onUpload,
  onRemove,
  isLoading = false,
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const avatarUrl = previewUrl || currentAvatar?.url;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (e.g. JPEG, PNG, WEBP) are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    const success = await onUpload(selectedFile);
    if (success) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleCancelPreview = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    handleCancelPreview();
    await onRemove();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200/80">
      {/* Avatar Display */}
      <div className="relative group shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-600 text-white font-black text-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Change Camera Overlay Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg border-2 border-white transition-all cursor-pointer disabled:opacity-50"
          title="Choose New Image"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Controls & Actions */}
      <div className="space-y-3 text-center sm:text-left flex-1">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">Profile Photo</h4>
          <p className="text-xs text-slate-500 font-medium">
            JPEG, PNG or WEBP. Maximum file size 5MB.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
          {selectedFile ? (
            <>
              <button
                type="button"
                onClick={handleSaveAvatar}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isLoading ? "Uploading..." : "Save Image"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelPreview}
                disabled={isLoading}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>

              {currentAvatar?.url && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploader;
