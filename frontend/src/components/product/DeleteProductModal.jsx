import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../common/Button";

export const DeleteProductModal = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
  deleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Delete Product</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-800">
              "{productTitle || "this product"}"
            </span>
            ? This will permanently remove the product and its images.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={deleting}
            loadingText="Deleting..."
          >
            Delete Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
