import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import RecordCard from "../../Components/RecordCard";
import OrbyChat from "../../Components/OrbyChat";

export default function Records() {
  const url = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [entryType, setEntryType] = useState("All");
  const [sortBy, setSortBy] = useState("Time Desc");
  const [records, setRecords] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showOrbyChat, setShowOrbyChat] = useState(false);

  const navigate = useNavigate();
  const { token, shc_code } = useAuth();

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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-gray-400" />
            <h2 className="text-lg font-bold">Filter & Search</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search by diagnosis, doctor, hospital"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="h-11 min-w-[160px] border border-gray-200 rounded-lg px-4 text-sm"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
            >
              <option value="All">All Records</option>
              <option value="Hospital">Hospital</option>
              <option value="Doctor">Doctor</option>
              <option value="Self">Self</option>
            </select>

            <select
              className="h-11 min-w-[160px] border border-gray-200 rounded-lg px-4 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Time Desc">Newest First</option>
              <option value="Time Asc">Oldest First</option>
              <option value="Diagnosis">Diagnosis (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Records Display */}
        <div className="space-y-4">
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
