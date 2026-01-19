import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import { FaPencilAlt } from "react-icons/fa";

import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

import BackButton from "../../Components/BackButton";
import PersonalDetails from "../../Components/PesonalDetails";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();

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
  
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

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
        <PersonalDetails data={data}/>

        {/* Lifestyle */}
        <div className="w-full max-w-7xl bg-white border rounded-lg p-4 sm:p-6 md:p-6 shadow-sm relative gap-2 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7]">
            Lifestyle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 items-start">
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
