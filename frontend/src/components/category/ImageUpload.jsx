import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

export const ImageUpload = ({
  currentImageUrl,
  onFileSelect,
  error,
  required = false,
  label = "Category Image",
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState("");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  useEffect(() => {
    // If there is an existing image URL from backend, use it as initial preview
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [currentImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setFileError("");

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();
    const isValidType =
      allowedTypes.includes(file.type) || allowedExtensions.includes(extension);

    if (!isValidType) {
      const err = "Only JPG, JPEG, PNG, and WEBP image formats are allowed.";
      setFileError(err);
      onFileSelect(null, err);
      return;
    }

    // Clean up old object URL if created
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file, null);
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(currentImageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null, null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const activeError = error || fileError;

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] bg-slate-50/50 hover:bg-slate-50 ${
          activeError
            ? "border-red-400 bg-red-50/10"
            : "border-slate-300 hover:border-indigo-400"
        }`}
      >
        {previewUrl ? (
          <div className="relative flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white relative">
              <img
                src={previewUrl}
                alt="Category Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-600 font-semibold hover:underline">
                Click or drag to change image
              </span>
              {previewUrl !== currentImageUrl && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Remove selected image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, JPEG or WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {activeError && (
        <p className="text-xs text-red-500 font-medium">{activeError}</p>
      )}
    </div>
  );
};

export default ImageUpload;
