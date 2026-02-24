"use client";
import React from "react";

function Textarea({
  label,
  placeholder = "",
  rows = 6,
  error,
  registerProps,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-s8 ${className}`}>
      {label && (
        <label className="heading-h6 text-main">
          {label} <span className="text-red-600">*</span>
        </label>
      )}

      <textarea
        {...registerProps}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full
          resize-none
          bg-secondary-main
          rounded-r24
          px-s24
          py-s16
          outline-none
          text-main
          ${error ? "border border-primary-main" : ""}
        `}
        {...props}
      />

      {error && (
        <p className="text-red-600 caption">{error}</p>
      )}
    </div>
  );
}

export default Textarea;
