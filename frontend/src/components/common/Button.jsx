import React from "react";

const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 focus:ring-indigo-500",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 focus:ring-red-500",
  outline:
    "bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
  md: "px-4 py-2.5 text-sm font-semibold rounded-xl",
  lg: "px-5 py-3 text-base font-semibold rounded-xl",
};

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
