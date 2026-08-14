import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Profile from "./Profile";
import { FaEnvelope, FaPhone, FaLock, FaCheck } from "react-icons/fa";

import { API_BASE_URL } from "../config/api";

export default function ProfileChange({ data }) {
  const { token, role } = useAuth();

  const [profile, setProfile] = useState({
    email: data.email || "",
    phone: data.phone_no || "",
    password: "",
    photo: data.photo || "",
  });

  React.useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      email: data.email || "",
      phone: data.phone_no || "",
      photo: data.photo || "",
    }));
  }, [data]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const payload = {};
  const changeHandler = async (field) => {
    if (
      !window.confirm(
        `Are you sure you want to update your ${field.replace("_", " ")}?`,
      )
    ) {
      return;
    }

    if (field == "email") {
      payload.newEmail = profile.email;
    } else if (field == "phone") {
      payload.newPhone = profile.phone;
    } else if (field == "password") {
      payload.newPassword = profile.password;
    } else {
      payload.newPhoto = profile.photo;
    }

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/${role}/profile/${field}`,
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
      toast.error("API Error: " + (err.response?.data?.error || err.message));
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);

      await axios.patch(
        `${API_BASE_URL}/${role}/profile/photo`,
        { newPhoto: res.data.url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error("Photo upload error response:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Photo upload failed.");
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
            {/* Left Column: Security Overview & Avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                  {data.photo ? (
                    <img
                      src={data.photo}
                      alt={data.full_name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-blue-600 uppercase">
                      {(data.full_name || "U")[0]}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {role === "doctor" ? "Dr. " : ""}
                  {data.full_name || "User Account"}
                </h3>
                <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-medium">
                  {role || "User Role"}
                </p>

                <div className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                  Security & Access Controls
                </div>
              </div>
            </div>

            {/* Right Column: Security Forms */}
            <div className="w-full md:w-2/3 flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-2">
                Account & Security
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
                    <span>Change</span>
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
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none group-hover:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => changeHandler("phone")}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    Change
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
                    Change
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
