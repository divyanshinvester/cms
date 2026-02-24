"use client";
import React from "react";

function Input({
  label,
  placeholder,
  error,
  registerProps,
}) {
  return (
    <div className="flex flex-col gap-s8">
      {label && (
        <label className="heading-h6">
          {label} <span className="text-red-600">*</span>
        </label>
      )}

      <input
        placeholder={placeholder}
        {...registerProps}
        className={`
          w-full
          rounded-r24
          px-s24
          py-s16
          outline-none
          bg-secondary-main
          ${error ? "border border-primary-main" : ""}
        `}
      />

      {error && (
        <p className="text-red-500 caption">{error}</p>
      )}
    </div>
  );
}

export default Input;
