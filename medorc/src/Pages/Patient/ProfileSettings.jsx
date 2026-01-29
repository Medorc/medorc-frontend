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

import {
  Cigarette,
  Wine,
  Coffee,
  Activity,
  Baby,
  FileText,
  AlertCircle,
  Save,
  Pencil,
} from "lucide-react";

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
        await axios.patch(
          urlLifestyle,
          { newLifestyle: data },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Lifestyle updated successfully!");
        setIsLifestyleEditing(false);
      } catch (err) {
        toast.error(
          "Update failed: " + (err.response?.data?.error || err.message),
        );
      }
    } else {
      setIsLifestyleEditing(true);
    }
  };

  // Toggle Edit / Save for Personal
  const togglePersonalEdit = async () => {
    if (isPersonalEditing) {
      try {
        await axios.patch(
          urlPersonal,
          // Send only the relevant fields for personal details
          {
            full_name: data.full_name,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
            address: data.address,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Personal details updated successfully!");
        setIsPersonalEditing(false);
      } catch (err) {
        toast.error(
          "Update failed: " + (err.response?.data?.error || err.message),
        );
      }
    } else {
      setIsPersonalEditing(true);
    }
  };

  // Configuration for the colorful tiles
  const lifestyleConfig = [
    {
      key: "smoking",
      label: "Smoking",
      icon: Cigarette,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      key: "alcoholism",
      label: "Alcohol",
      icon: Wine,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      key: "tobacco",
      label: "Tobacco",
      icon: Coffee,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      key: "exercise",
      label: "Exercise",
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      key: "pregnancy",
      label: "Pregnancy",
      icon: Baby,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
  ];

  // Helper to toggle checkbox when tile is clicked
  const handleTileClick = (key) => {
    if (!isLifestyleEditing) return;
    // Manually trigger the handleChange logic
    handleChange({
      target: { id: key, type: "checkbox", checked: !data[key] },
    });
  };

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
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all active:scale-95 z-10 ${isPersonalEditing ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            title={
              isPersonalEditing
                ? "Save Personal Details"
                : "Edit Personal Details"
            }
          >
            {isPersonalEditing ? <FaCheck /> : <FaPencilAlt />}
          </button>
        </div>

        {/* Lifestyle */}
        {/* LIFESTYLE CARD SECTION */}
        <div
          className={`w-full max-w-7xl bg-white rounded-3xl overflow-hidden transition-all duration-300 ${isLifestyleEditing ? "shadow-xl ring-2 ring-blue-500/20" : "shadow-sm border border-slate-100"}`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Lifestyle & Habits
                </h3>
                <p className="text-slate-400 text-sm hidden sm:block">
                  Manage medical alerts and history
                </p>
              </div>
            </div>

            {/* Edit/Save Button */}
            <button
              onClick={toggleLifestyleEdit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                isLifestyleEditing
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isLifestyleEditing ? (
                <>
                  <Save size={16} /> Save
                </>
              ) : (
                <>
                  <Pencil size={14} /> Edit
                </>
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 flex flex-col gap-8">
            {/* 1. Habits Tiles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {lifestyleConfig.map(({ key, label, icon: Icon, color, bg }) => {
                const isActive = data[key] || false;
                return (
                  <div
                    key={key}
                    onClick={() => handleTileClick(key)}
                    className={`
              relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 select-none
              ${isLifestyleEditing ? "cursor-pointer hover:scale-[1.02] active:scale-95" : "cursor-default"}
              ${isActive ? `${bg} ${color} border-current shadow-sm` : "bg-white border-slate-100 text-slate-400 grayscale"}
            `}
                  >
                    {/* Hidden Input for Form Logic */}
                    <input
                      type="checkbox"
                      id={key}
                      checked={isActive}
                      readOnly
                      className="hidden"
                    />

                    {/* Active Dot */}
                    {isActive && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current animate-pulse" />
                    )}

                    <Icon size={28} className="mb-2" />
                    <span className="font-semibold text-sm">{label}</span>
                    <span className="text-[10px] mt-1 font-medium opacity-80">
                      {isActive ? "Active" : "None"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 2. Text Areas (Others & Allergies) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Other Habits */}
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="others"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <FileText size={16} className="text-blue-500" /> Other Habits
                </label>
                <textarea
                  id="others"
                  className={`w-full p-4 rounded-xl text-sm leading-relaxed outline-none transition-all resize-none ${
                    isLifestyleEditing
                      ? "bg-white border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-800 shadow-sm min-h-[120px]"
                      : "bg-slate-50 border border-transparent text-slate-600 min-h-[100px]"
                  }`}
                  value={data.others || ""}
                  onChange={handleChange}
                  readOnly={!isLifestyleEditing}
                  placeholder={
                    isLifestyleEditing
                      ? "Enter other habits..."
                      : "No additional habits recorded."
                  }
                />
              </div>

              {/* Allergies */}
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="allergy"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <AlertCircle size={16} className="text-rose-500" /> Allergies
                </label>
                <textarea
                  id="allergy"
                  className={`w-full p-4 rounded-xl text-sm leading-relaxed outline-none transition-all resize-none ${
                    isLifestyleEditing
                      ? "bg-white border-2 border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 text-slate-800 shadow-sm min-h-[120px]"
                      : "bg-rose-50/50 border border-transparent text-slate-600 min-h-[100px]"
                  }`}
                  value={data.allergy || ""}
                  onChange={handleChange}
                  readOnly={!isLifestyleEditing}
                  placeholder={
                    isLifestyleEditing
                      ? "List allergies here..."
                      : "No known allergies."
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
