import React, { useState } from "react";
import { User, Calendar, MapPin, Users, Edit3, Droplet, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";

export default function PersonalDetails({ data, isEditing, onChange, onPhotoUpdate }) {
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString, forInput = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    if (forInput) return date.toISOString().split("T")[0];
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      const photoUrl = res.data.url;
      toast.success("Profile photo uploaded!");
      if (onPhotoUpdate) {
        onPhotoUpdate(photoUrl);
      } else {
        onChange({ target: { id: "photo", value: photoUrl } });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error(err.response?.data?.error || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (onPhotoUpdate) {
      onPhotoUpdate("");
    } else {
      onChange({ target: { id: "photo", value: "" } });
    }
    toast.info("Photo removed. Click Save to apply changes.");
  };

  const InputField = ({
    label,
    icon: Icon,
    id,
    type = "text",
    value,
    options,
  }) => (
    <div className="group">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-2 ml-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={18} />
        </div>

        {options ? (
          isEditing ? (
            <select
              id={id}
              className="w-full pl-10 pr-4 py-3 border rounded-xl appearance-none transition-all outline-none bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 text-slate-900"
              value={value || ""}
              onChange={onChange}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium">
              {value || "Not Specified"}
            </div>
          )
        ) : (
          <input
            type={id === "date_of_birth" && isEditing ? "date" : type}
            id={id}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all outline-none ${
              isEditing
                ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 text-slate-900"
                : "bg-slate-50 border-slate-200 text-slate-600 font-medium"
            }`}
            value={
              id === "date_of_birth"
                ? formatDate(value, isEditing)
                : value || ""
            }
            onChange={onChange}
            readOnly={!isEditing}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`w-full max-w-7xl mx-auto bg-white rounded-3xl p-8 flex flex-col gap-3 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 relative overflow-hidden ${
        isEditing ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1.5 ${
          isEditing ? "bg-blue-500" : "bg-slate-200"
        }`}
      ></div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Personal Profile
            </h3>
            <p className="text-slate-500 text-sm">
              Basic information, blood group, and avatar
            </p>
          </div>
        </div>
        {isEditing && (
          <span className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 animate-pulse">
            <Edit3 size={12} /> Editing Mode
          </span>
        )}
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-10">
        {/* Left Column: Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              label="Full Name"
              icon={User}
              id="full_name"
              value={data.full_name}
            />
          </div>

          <InputField
            label="Date of Birth"
            icon={Calendar}
            id="date_of_birth"
            value={data.date_of_birth}
          />

          <InputField
            label="Gender"
            icon={Users}
            id="gender"
            value={data.gender}
            options={["Male", "Female", "Other"]}
          />

          <InputField
            label="Blood Group"
            icon={Droplet}
            id="blood_group"
            value={data.blood_group}
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />

          <div className="md:col-span-2 group">
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-slate-700 mb-2 ml-1"
            >
              Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <MapPin size={18} />
              </div>
              <textarea
                id="address"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl resize-none h-28 transition-all outline-none ${
                  isEditing
                    ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-600 font-medium"
                }`}
                value={data.address || ""}
                onChange={onChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Profile Photo Upload & Preview */}
        <div className="flex flex-col items-center justify-start pt-2">
          <div className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full blur opacity-30 ${
                isEditing ? "opacity-60" : ""
              } transition duration-500`}
            ></div>
            <div className="relative w-44 h-44 rounded-full p-1.5 bg-white shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 relative bg-slate-100 flex items-center justify-center">
                {data.photo ? (
                  <img
                    src={data.photo}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    alt="Profile"
                  />
                ) : (
                  <User size={64} className="text-slate-300" />
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            Profile Photo
          </p>

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                <Upload size={14} />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {data.photo && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1"
                  title="Remove Photo"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
