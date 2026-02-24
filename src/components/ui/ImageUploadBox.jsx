"use client";
import React, { useEffect, useRef, useState } from "react";

function ImageUploadBox({
  label,
  onChange,
  initialUrl = null, // ✅ NEW (for edit)
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialUrl);
  const [dragActive, setDragActive] = useState(false);

  /* 🔹 sync preview when edit data loads */
  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
    }
  }, [initialUrl]);

  const handleFile = (file) => {
    if (!file) return;

    // ✅ allow images only
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange?.(file);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col items-center gap-s8 w-full">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`
          w-full
          h-[140px]
          rounded-r24
          cursor-pointer
          flex
          items-center
          justify-center
          overflow-hidden
          transition
          ${dragActive ? "bg-primary-light" : "bg-secondary-main"}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col justify-center items-center gap-s8">
            <div className="
              w-[44px] h-[44px]
              rounded-full
              border-2 border-primary-main
              flex items-center justify-center
              text-xl text-primary-main
            ">
              +
            </div>
            <p className="caption text-secondary">drag and drop</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleInputChange}
        />
      </div>

      <p className="text-secondary body-small">{label}</p>
    </div>
  );
}

export default ImageUploadBox;
