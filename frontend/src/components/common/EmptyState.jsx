import React from "react";
import { FolderPlus, Plus } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  title = "No categories found.",
  description = "Create your first category to start organizing products.",
  actionText = "Create Category",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 my-4 shadow-xs">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-xs">
        <FolderPlus className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="primary" icon={Plus} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
