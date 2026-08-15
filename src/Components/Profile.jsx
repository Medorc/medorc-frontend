import { useState, useRef } from "react";

import { FiCamera } from "react-icons/fi";

export default function Profile({ onFileSelect, photo, size = 112 }) {
  const [imagePreview, setImagePreview] = useState(photo);
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handlePhotoClick}
        aria-label="Upload profile photo"
        className="group relative overflow-hidden rounded-full border-2 border-dashed border-border bg-surface shadow-card transition-colors hover:border-primary/50"
        style={{ width: size, height: size }}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 text-center text-xs font-medium text-subtle">
            <FiCamera size={22} aria-hidden="true" />
            Profile Photo
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100">
          <FiCamera size={24} className="text-white" aria-hidden="true" />
        </span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  );
}
