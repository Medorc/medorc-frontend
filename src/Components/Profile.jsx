import React, { useState, useRef } from "react";

const Styles = () => (
  <style>
    {`
      .photo {
        display: flex;
        justify-content: center;
        margin: 10px 0;
      }
      .photoCircle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 12px;
        font-family: sans-serif;
        color: #555;
        cursor: pointer;
        transition: background 0.3s;
        overflow: hidden;
      }
      .photoCircle:hover {
        background: #c7d2fe;
      }
      .profileImagePreview {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    `}
  </style>
);

export default function Profile({ onFileSelect, photo }) {
  const [imagePreview, setImagePreview] = useState(photo || null);
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show preview immediately
      onFileSelect(file); // 👈 Send file to Signup for Cloudinary upload
      console.log("Selected file:", file.name);
    }
  };

  return (
    <>
      <Styles />
      <div className="photo">
        <div className="photoCircle" onClick={handlePhotoClick}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="profileImagePreview"
            />
          ) : (
            <>
              Profile Photo <br /> (Optional)
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>
    </>
  );
}
