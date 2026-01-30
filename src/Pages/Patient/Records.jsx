import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import RecordCard from "../../Components/RecordCard";
import OrbyChat from "../../Components/OrbyChat";

export default function Records() {
  const url = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [entryType, setEntryType] = useState("All");
  const [sortBy, setSortBy] = useState("Time Desc");
  const [records, setRecords] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, shc_code } = useAuth();

  // Check if navigated with openOrby flag
  const [showOrbyChat, setShowOrbyChat] = useState(location.state?.openOrby || false);

  useEffect(() => {
    if (!token) return;

    const fetchRecords = async () => {
      try {
        const payload = {
          searchOptions: { sort_by: sortBy, entry_type: entryType },
          shc_code: shc_code,
          searchQuery: searchTerm,
        };

        const res = await axios.post(`${url}/api/v1/patient/records`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecords(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/patient/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchRecords();
    fetchUserProfile();
  }, [searchTerm, entryType, sortBy, shc_code, token]);

  if (showOrbyChat) {
    return (
      <OrbyChat
        userName={userProfile?.full_name || "User"}
        onBack={() => setShowOrbyChat(false)}
        shcCode={userProfile?.shc_code}
        qrCode={userProfile?.qr_code}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="w-full mx-auto px-4 py-8 space-y-6 flex flex-col gap-6">
        {/* Header */}
        <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#50E3C2]">
              {userProfile?.photo ? (
                <img
                  src={userProfile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-gray-600 bg-gray-200">
                  {userProfile?.full_name?.[0]}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0751A7]">
                Medical Records
              </h1>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  {userProfile?.full_name || "Loading..."}
                </span>{" "}
                • SHC: {userProfile?.shc_code || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4A82B3] text-white text-sm font-semibold hover:bg-[#4A82B3]/80"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              onClick={() => navigate("/patient/addrecord")}
              className="px-6 py-2.5 rounded-lg bg-[#4A90E2] text-white text-sm font-semibold hover:bg-[#4A90E2]/80"
            >
              Add Record
            </button>
            <button
              onClick={() => setShowOrbyChat(true)}
              className="px-6 py-2.5 rounded-lg bg-[#4A90E2] text-white text-sm font-semibold hover:bg-[#4A90E2]/80"
            >
              Ask Orby
            </button>
          </div>
        </div>

        {/* Filters and Search - Redesigned */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border-none rounded-xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Search records by diagnosis, doctor, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 rounded-xl">
                <FiCalendar className="text-gray-500" />
                <select
                  className="h-12 bg-transparent border-none text-gray-700 font-medium focus:ring-0 cursor-pointer outline-none min-w-[140px]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Time Desc">Newest First</option>
                  <option value="Time Asc">Oldest First</option>
                  <option value="Diagnosis">Diagnosis (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Entry Type Pills */}
            <div className="flex flex-wrap gap-2">
              {["All", "Hospital", "Doctor", "Self"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEntryType(type)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${entryType === type ? "text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {entryType === type && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-md shadow-blue-500/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{type === "All" ? "All Records" : type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records Display */}
        <div className="flex flex-col gap-2">
          {records.length ? (
            records.map((r) => (
              <RecordCard key={r.record_id} record={r} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No records found</p>
          )}
        </div>
      </main>
    </div>
  );
}
