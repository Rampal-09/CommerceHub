import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Images, X } from "lucide-react";

export const GalleryUpload = ({
  existingImages = [], // Array of Cloudinary image objects [{ url, public_id }]
  onFilesSelect,
  error,
  maxImages = 5,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [fileError, setFileError] = useState("");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  useEffect(() => {
    return () => {
      // Clean up object URLs on unmount
      filePreviews.forEach((prev) => {
        if (prev.isNew && prev.url.startsWith("blob:")) {
          URL.revokeObjectURL(prev.url);
        }
      });
    };
  }, [filePreviews]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (newFiles) => {
    setFileError("");

    if (newFiles.length === 0) return;

    // Check file extensions
    const invalidFiles = newFiles.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return !allowedTypes.includes(file.type) && !allowedExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      const err = "Only JPG, JPEG, PNG, and WEBP images are allowed.";
      setFileError(err);
      return;
    }

    const totalCount = selectedFiles.length + newFiles.length;
    if (totalCount > maxImages) {
      const err = `Maximum ${maxImages} gallery images allowed.`;
      setFileError(err);
      return;
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      name: file.name,
    }));

    setFilePreviews((prev) => [...prev, ...newPreviews]);
    onFilesSelect(updatedFiles);
  };

  const handleRemoveNewFile = (index) => {
    const previewToRemove = filePreviews[index];
    if (previewToRemove?.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRemove.url);
    }

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
    onFilesSelect(updatedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    validateAndAddFiles(files);
  };

  const activeError = error || fileError;
  const hasExisting = existingImages && existingImages.length > 0;

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Gallery Images{" "}
          <span className="text-slate-400 font-normal lowercase">
            (max {maxImages} images)
          </span>
        </label>
        {selectedFiles.length > 0 && (
          <span className="text-xs text-indigo-600 font-bold">
            {selectedFiles.length} new selected
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesChange}
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
      />

      {/* Dropzone Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 ${
          activeError
            ? "border-red-400 bg-red-50/10"
            : "border-slate-300 hover:border-indigo-400"
        }`}
      >
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <Images className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-700">
          Click to upload gallery images{" "}
          <span className="font-normal text-slate-500">or drag and drop</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          JPEG, PNG or WEBP (Up to {maxImages} images)
        </p>
      </div>

      {activeError && (
        <p className="text-xs text-red-500 font-medium">{activeError}</p>
      )}

      {/* Previews Grid: Existing Cloudinary Images */}
      {hasExisting && filePreviews.length === 0 && (
        <div className="space-y-1.5 pt-2">
          <span className="block text-[11px] font-bold text-slate-400 uppercase">
            Current Gallery Images ({existingImages.length}):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {existingImages.map((img, idx) => (
              <div
                key={img.public_id || idx}
                className="relative group w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
              >
                <img
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                  Existing Image
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Uploading new gallery images above will replace the current gallery images.
          </p>
        </div>
      )}

      {/* Previews Grid: Newly Selected File Previews */}
      {filePreviews.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <span className="block text-[11px] font-bold text-indigo-600 uppercase">
            New Gallery Previews ({filePreviews.length}):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {filePreviews.map((prev, idx) => (
              <div
                key={idx}
                className="relative group w-full aspect-square rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50/20 shadow-2xs"
              >
                <img
                  src={prev.url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNewFile(idx);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-xs cursor-pointer transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
