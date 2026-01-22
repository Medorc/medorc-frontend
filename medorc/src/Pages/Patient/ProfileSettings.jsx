import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import { FaPencilAlt, FaCheck } from "react-icons/fa"; // Using consistent icons

import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

import BackButton from "../../Components/BackButton";
import PersonalDetails from "../../Components/PesonalDetails";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [data, setData] = useState({
    // Initial state matching interface
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

  // Separate editing states for sections
  const [isLifestyleEditing, setIsLifestyleEditing] = useState(false);
  const [isPersonalEditing, setIsPersonalEditing] = useState(false);

  const urlPersonal = "http://localhost:3000/api/v1/patient/profile/personal";
  const urlLifestyle = "http://localhost:3000/api/v1/patient/profile/lifestyle";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);


  // Fetch initial data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(urlPersonal, {
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

  // Handle Input Change
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle Edit / Save for Lifestyle
  const toggleLifestyleEdit = async () => {
    if (isLifestyleEditing) {
      try {
        await axios.patch(urlLifestyle,
          { newLifestyle: data },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success("Lifestyle updated successfully!");
        setIsLifestyleEditing(false);
      } catch (err) {
        toast.error("Update failed: " + (err.response?.data?.error || err.message));
      }
    } else {
      setIsLifestyleEditing(true);
    }
  };

  // Toggle Edit / Save for Personal
  const togglePersonalEdit = async () => {
    if (isPersonalEditing) {
      try {
        await axios.patch(urlPersonal,
          // Send only the relevant fields for personal details
          {
            full_name: data.full_name,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
            address: data.address
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success("Personal details updated successfully!");
        setIsPersonalEditing(false);
      } catch (err) {
        toast.error("Update failed: " + (err.response?.data?.error || err.message));
      }
    } else {
      setIsPersonalEditing(true);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavBar />

      {/* Header */}
      <BackButton />
      <NavButton />

      <div className="flex flex-col items-center gap-8 px-4 sm:px-6 lg:px-12 pb-10">

        {/* Personal Details Section */}
        <div className="w-full max-w-7xl relative">
          <PersonalDetails
            data={data}
            isEditing={isPersonalEditing}
            onChange={handleChange}
          />
          {/* Edit Button for Personal Details */}
          <button
            onClick={togglePersonalEdit}
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all active:scale-95 z-10 ${isPersonalEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title={isPersonalEditing ? "Save Personal Details" : "Edit Personal Details"}
          >
            {isPersonalEditing ? <FaCheck /> : <FaPencilAlt />}
          </button>
        </div>


        {/* Lifestyle */}
        <div className={`w-full max-w-7xl bg-white border rounded-lg p-4 sm:p-6 md:p-6 shadow-sm relative gap-2 flex flex-col transition-all ${isLifestyleEditing ? 'ring-2 ring-blue-500/20' : ''}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7]">
              Lifestyle
            </h3>
            {isLifestyleEditing && <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Editing Mode</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 pb-2 items-start">
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
                    className="form-checkbox text-blue-500 rounded focus:ring-0 w-4 h-4 cursor-pointer"
                    checked={data[key] || false}
                    onChange={handleChange}
                    disabled={!isLifestyleEditing}
                  />
                  <label htmlFor={key} className={`cursor-pointer ${!isLifestyleEditing && 'cursor-default'}`}>{label}</label>
                </div>
              ))}
            </div>

            {/* Other habits */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="others"
                className="text-sm text-gray-600 mb-1"
              >
                Other habits (if any)
              </label>
              <textarea
                id="others"
                className={`border-2 rounded px-4 py-2 w-full h-24 resize-none transition-colors ${isLifestyleEditing ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                value={data.others || ""}
                onChange={handleChange}
                readOnly={!isLifestyleEditing}
                placeholder={isLifestyleEditing ? "Enter other habits..." : "--"}
              />
            </div>

            {/* Allergies */}
            <div className="flex flex-col gap-2">
              <label htmlFor="allergy" className="text-sm text-gray-600 mb-1">
                Allergies (if any)
              </label>
              <textarea
                id="allergy"
                className={`border-2 rounded px-4 py-2 w-full h-24 resize-none transition-colors ${isLifestyleEditing ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                value={data.allergy || ""}
                onChange={handleChange}
                readOnly={!isLifestyleEditing}
                placeholder={isLifestyleEditing ? "Enter alleries..." : "None"}
              />
            </div>
          </div>

          <button
            onClick={toggleLifestyleEdit}
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all active:scale-95 ${isLifestyleEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title={isLifestyleEditing ? "Save Changes" : "Edit Details"}
          >
            {isLifestyleEditing ? <FaCheck /> : <FaPencilAlt />}
          </button>
        </div>
      </div>
    </div>
  );
}
