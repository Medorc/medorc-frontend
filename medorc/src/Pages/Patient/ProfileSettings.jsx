import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import { FaPencilAlt } from "react-icons/fa";

import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from "../../Components/BackButton";


export default function ProfileSettings() {
  const [data, setData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    address: "",
    photo: "",
    smoking: false,
    alcoholism: false,
    tobacco: false,
    exercise: false,
    pregnancy: false,
    others: "",
    allergy: "",
  });

  const { token } = useAuth();
  const Navigate = useNavigate();

  const url = "http://localhost:3000/api/v1/patient/profile/personal";

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setData(res.data.data);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavBar />

      {/* Header */}
      <BackButton/>
      <NavButton />

      <div className="flex flex-col items-center gap-8 px-4 sm:px-6 lg:px-12">
        {/* Personal Details */}
        <div className="w-full max-w-6xl bg-white border rounded-lg p-4 sm:p-6 md:p-8 shadow flex flex-col gap-4">
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
                <label
                  htmlFor="dob"
                  className="text-sm text-gray-600 w-28 sm:w-32"
                >
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
                <label
                  htmlFor="address"
                  className="text-sm text-gray-600 mb-1"
                >
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
                <div className="w-20 h-20 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full flex justify-center items-center">
                  <img
                    src="https://wallpapers.com/images/featured/vijay-hd-27mgorooz2ewisvi.jpg"
                    className="h-16 sm:h-20 md:h-24 lg:h-26 object-contain rounded-full"
                    alt="profile"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="w-full max-w-6xl bg-white border rounded-lg p-4 sm:p-6 md:p-6 shadow-sm relative gap-2 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7]">
            Lifestyle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 items-start">
            {/* Habits */}
            <div className="flex flex-col gap-2">
              {[
                { key: "smoking", label: "Smoking" },
                { key: "alcoholism", label: "Alcoholism" },
                { key: "tobacco", label: "Tobacco" },
                { key: "exercise", label: "Exercise habit" },
                { key: "pregnancy", label: "Pregnancy" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <input
                    type="checkbox"
                    id={key}
                    className="form-checkbox text-blue-500 rounded focus:ring-0 w-4 h-4"
                    checked={data[key]}
                    readOnly
                  />
                  <label htmlFor={key}>{label}</label>
                </div>
              ))}
            </div>

            {/* Other habits */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="otherHabits"
                className="text-sm text-gray-600 mb-1"
              >
                Other habits (if any)
              </label>
              <textarea
                id="otherHabits"
                className="border-2 rounded px-4 py-2 w-full h-24 resize-none"
                value={data.others || "--"}
                readOnly
              />
            </div>

            {/* Allergies */}
            <div className="flex flex-col gap-2">
              <label htmlFor="allergies" className="text-sm text-gray-600 mb-1">
                Allergies (if any)
              </label>
              <textarea
                id="allergies"
                className="border-2 rounded px-4 py-2 w-full h-24 resize-none"
                value={data.allergy || "Peanuts, Pollen"}
                readOnly
              />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-gray-500 text-lg sm:text-xl">
            <FaPencilAlt />
          </div>
        </div>
      </div>
    </div>
  );
}
