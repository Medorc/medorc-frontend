import React from "react";
import { User, Calendar, MapPin, Users, Edit3 } from "lucide-react";

export default function PersonalDetails({ data, isEditing, onChange }) {
  // Helper to format date for input vs display
  const formatDate = (dateString, forInput = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (forInput) return date.toISOString().split("T")[0];
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
              className={`w-full pl-10 pr-4 py-3 border rounded-xl appearance-none transition-all outline-none ${
                isEditing
                  ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
              value={value || "Male"}
              onChange={onChange}
              disabled={!isEditing}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
              {value || "Male"}
            </div>
          )
        ) : (
          <input
            type={id === "date_of_birth" && isEditing ? "date" : type}
            id={id}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all outline-none ${
              isEditing
                ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 text-slate-900"
                : "bg-slate-50 border-slate-200 text-slate-600"
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
      className={`w-full max-w-7xl mx-auto bg-white rounded-3xl p-8 flex flex-col gap-3 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 relative overflow-hidden ${isEditing ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
    >
      {/* Visual Header Indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-1.5 ${isEditing ? "bg-blue-500" : "bg-slate-200"}`}
      ></div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex  items-center gap-2">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Personal Details
            </h3>
            <p className="text-slate-500 text-sm">Basic profile information</p>
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
                className={`w-full pl-10 pr-4 py-3 border rounded-xl resize-none h-32 transition-all outline-none ${
                  isEditing
                    ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
                value={data.address || ""}
                onChange={onChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Profile Photo */}
        <div className="flex flex-col items-center justify-start pt-4">
          <div className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur opacity-30 ${isEditing ? "opacity-60" : ""} transition duration-500`}
            ></div>
            <div className="relative w-40 h-40 rounded-full p-1.5 bg-white shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50">
                <img
                  src={data.photo || "/image.png"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  alt="profile"
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-400">
            Profile Photo
          </p>
        </div>
      </div>
    </div>
  );
}
