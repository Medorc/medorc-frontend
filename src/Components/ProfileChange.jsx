import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Profile from "./Profile";
import { FaEnvelope, FaPhone, FaLock, FaCheck } from "react-icons/fa";

export default function ProfileChange({ data }) {
  const url = "http://localhost:3000";
  const { token, role } = useAuth();

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr8hcq37p/upload";
  const CLOUDINARY_UPLOAD_PRESET = "Medorc";

  // local editable state

  const [profile, setProfile] = useState({
    email: data.email || "",
    phone_no: data.phone_no || "",
    password: "",
    photo: data.photo || "",
  });

  // Sync state with data prop when it changes
  React.useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      email: data.email || "",
      phone_no: data.phone_no || "",
      photo: data.photo || "",
    }));
  }, [data]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const payload = {};
  const changeHandler = async (field) => {
    // Confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to update your ${field.replace("_", " ")}?`,
      )
    ) {
      return;
    }

    if (field == "email") {
      payload.newEmail = profile.email;
    } else if (field == "phone_no") {
      payload.newPhoneNo = profile.phone_no;
    } else if (field == "password") {
      payload.newPassword = profile.password;
    } else {
      payload.newPhoto = profile.photo;
    }

    try {
      const res = await axios.patch(
        `${url}/api/v1/${role}/profile/${field}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(`${field.replace("_", " ")} updated successfully`);
    } catch (err) {
      toast.error("API Error: " + (err.response?.data || err.message));
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);

      const uploadRes = await axios.patch(
        `${url}/api/v1/${role}/profile/photo`,
        { newPhoto: res.data.secure_url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.log("Cloudinary error response:", error.response?.data);
      toast.error("Upload failed. Check preset is unsigned.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
        {/* Decorative Background Blur */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Left Column: Photo & Static Info */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative">
                  <Profile
                    onFileSelect={(file) => handlePhotoUpload(file)}
                    photo={data.photo}
                  />
                  {/* Edit icon overlay could go here if Profile component allowed it */}
                </div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {role === "doctor" ? "Dr. " : ""}
                  {data.full_name || "User Name"}
                </h3>
                <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-medium">
                  {role || "User Role"}
                </p>
              </div>
            </div>

            {/* Right Column: Edit Forms */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-2">
                Account Settings
              </h2>

              {/* Email Section */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Email Address
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none group-hover:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => changeHandler("email")}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/10 active:scale-95 flex items-center gap-2"
                  >
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Phone Section */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="phone_no"
                      value={profile.phone_no}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none group-hover:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => changeHandler("phone_no")}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Password Section */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  New Password
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={profile.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none group-hover:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => changeHandler("password")}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
