import React, { useState } from "react";

export default function PesonalDetails({ data }) {
  return (
    <div className="w-full max-w-7xl bg-white border rounded-lg p-4 sm:p-6 md:p-8 shadow flex flex-col gap-4">
      <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7] mb-2">
        Personal Details
      </h3>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-3 flex-1 w-full md:w-1/2">
          {/* Full Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label
              htmlFor="fullName"
              className="text-sm text-gray-600 w-28 sm:w-32"
            >
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              className="border-2 rounded px-4 py-1 w-full sm:w-80"
              value={data.full_name || "John Doe"}
              readOnly
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label htmlFor="dob" className="text-sm text-gray-600 w-28 sm:w-32">
              Date of Birth:
            </label>
            <input
              type="text"
              id="dob"
              className="border-2 rounded px-4 py-1 w-full sm:w-80"
              value={
                data.date_of_birth
                  ? new Date(data.date_of_birth).toLocaleDateString("en-GB")
                  : ""
              }
              readOnly
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label
              htmlFor="gender"
              className="text-sm text-gray-600 w-28 sm:w-32"
            >
              Gender:
            </label>
            <input
              type="text"
              id="gender"
              className="border-2 rounded px-4 py-1 w-full sm:w-80"
              value={data.gender || "Male"}
              readOnly
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-1/2">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="address" className="text-sm text-gray-600 mb-1">
              Address:
            </label>
            <textarea
              id="address"
              className="border-2 rounded px-4 py-2 w-full h-24 resize-none"
              value={data.address || "123 Main St, City, Country"}
              readOnly
            />
          </div>

          <div className="flex justify-center items-center mt-4 md:mt-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full overflow-hidden">
              <img
                src={data.photo || "image.png"}
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
