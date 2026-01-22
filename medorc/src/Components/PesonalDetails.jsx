import React from "react";

export default function PersonalDetails({ data, isEditing, onChange }) {
  return (
    <div className={`w-full max-w-7xl bg-white border rounded-lg p-4 sm:p-6 md:p-8 shadow flex flex-col gap-4 transition-all ${isEditing ? 'ring-2 ring-blue-500/20' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7]">
          Personal Details
        </h3>
        {isEditing && <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Editing Mode</span>}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-3 flex-1 w-full md:w-1/2">
          {/* Full Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label
              htmlFor="full_name"
              className="text-sm text-gray-600 w-28 sm:w-32 font-medium"
            >
              Full Name:
            </label>
            <input
              type="text"
              id="full_name"
              className={`border-2 rounded px-4 py-1.5 w-full sm:w-80 transition-colors ${isEditing ? 'bg-white border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200' : 'bg-gray-50 border-gray-200'}`}
              value={data.full_name || ""}
              onChange={onChange}
              readOnly={!isEditing}
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label htmlFor="date_of_birth" className="text-sm text-gray-600 w-28 sm:w-32 font-medium">
              Date of Birth:
            </label>
            <input
              type={isEditing ? "date" : "text"}
              id="date_of_birth"
              className={`border-2 rounded px-4 py-1.5 w-full sm:w-80 transition-colors ${isEditing ? 'bg-white border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200' : 'bg-gray-50 border-gray-200'}`}
              value={
                data.date_of_birth
                  ? (isEditing ? new Date(data.date_of_birth).toISOString().split('T')[0] : new Date(data.date_of_birth).toLocaleDateString("en-GB"))
                  : ""
              }
              onChange={onChange}
              readOnly={!isEditing}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label
              htmlFor="gender"
              className="text-sm text-gray-600 w-28 sm:w-32 font-medium"
            >
              Gender:
            </label>
            {isEditing ? (
              <select
                id="gender"
                className="border-2 rounded px-4 py-1.5 w-full sm:w-80 bg-white border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={data.gender || "Male"}
                onChange={onChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                type="text"
                id="gender"
                className="border-2 rounded px-4 py-1.5 w-full sm:w-80 bg-gray-50 border-gray-200"
                value={data.gender || "Male"}
                readOnly
              />
            )}

          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-1/2">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="address" className="text-sm text-gray-600 mb-1 font-medium">
              Address:
            </label>
            <textarea
              id="address"
              className={`border-2 rounded px-4 py-2 w-full h-24 resize-none transition-colors ${isEditing ? 'bg-white border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200' : 'bg-gray-50 border-gray-200'}`}
              value={data.address || ""}
              onChange={onChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="flex justify-center items-center mt-4 md:mt-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full overflow-hidden shadow-md">
              <img
                src={data.photo || "/image.png"}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
