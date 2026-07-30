import React from "react";

export const Input = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  disabled = false,
  helperText,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/20"
            : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
        } ${disabled ? "bg-slate-100 cursor-not-allowed opacity-60" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
