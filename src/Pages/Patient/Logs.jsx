import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import NavButton from "../../Components/NavButton";
import BackButton from "../../Components/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";

import {
  FaSearch,
  FaEye,
  FaUserMd,
  FaIdBadge,
  FaEnvelope,
  FaPhoneAlt,
  FaClipboardList,
} from "react-icons/fa";

import { FiCalendar, FiX } from "react-icons/fi";

const headerColors = {
  blue: "bg-gradient-to-r from-blue-500 to-blue-600",
  red: "bg-gradient-to-r from-red-500 to-red-600",
  gray: "bg-gradient-to-r from-slate-500 to-slate-600",
};

const badgeColors = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  red: "bg-red-100 text-red-700 border-red-200",
  gray: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Logs() {
  const baseUrl = "http://localhost:3000";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const { token, shc_code } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // 🔹 Parse log string
  const parseLog = (log) => {
    const regex = /^(.+?) - (\w+) \[(.+?)\] (.+)$/;
    const match = log.match(regex);
    if (!match) return null;

    const [, timestamp, role, userId, action] = match;

    return {
      raw: log,
      timestamp,
      role,
      userId,
      action,
      formattedDate: new Date(timestamp).toLocaleString(),
    };
  };

  useEffect(() => {

    if (!token || !shc_code) return;

    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/v1/patient/profile/data-logs?shc_code=${shc_code}`,
          { headers: { Authorization: `Bearer ${token}`,shc_code } },
        );
        console.log(res.data);
        const rawLogs = res.data?.data?.data_logs || "";

        const logs = rawLogs
          .split(",")
          .map((log) => parseLog(log.trim()))
          .filter(Boolean)
          .reverse();

        setData(logs);
      } catch (err) {
        toast.error(
          "API Error: " + (err.response?.data?.message || err.message),
        );
      }
    };

    fetchLogs();
  }, [token, shc_code]);

  const filteredLogs = data
    .filter((log) => {
      const matchesSearch = log.raw
        .toLowerCase()
        .includes(search.toLowerCase());
      if (!matchesSearch) return false;

      const logDate = new Date(log.timestamp);
      // Append time to ensure local time parsing instead of UTC
      const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

      if (start && logDate < start) return false;
      if (end && logDate > end) return false;

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // 🔹 Fetch profile when eye clicked
  const handleViewDetails = async (log) => {
    try {
      let endpoint = `/api/v1/${log.role.toLowerCase()}/profile`;

      const res = await axios.get(`${baseUrl}${endpoint}`, {
        params: { viewer_id: log.userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedLog({ ...log, profile: res.data.data });
    } catch {
      toast.error("Failed to fetch profile");
    }
  };

  const getCreatorDetails = (log) => {
    const profile = log.profile || {};
    return {
      role: log.role,
      themeColor: log.role === "DOCTOR" ? "blue" : "red",
      name:
        log.role === "DOCTOR" || log.role === "EXTERN"
          ? profile.full_name
          : profile.name || "Unknown User",
      photo: profile.photo || null,
      details: [
        { icon: <FaIdBadge />, label: "User ID", value: log.userId },
        { icon: <FaClipboardList />, label: "Action", value: log.action },
        { icon: <FiCalendar />, label: "Date", value: log.formattedDate },
        { icon: <FaEnvelope />, label: "Email", value: profile.email },
        { icon: <FaPhoneAlt />, label: "Phone", value: profile.phone },
      ],
    };
  };

  const creator = selectedLog ? getCreatorDetails(selectedLog) : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <NavBar />

      {/* Main Content Container */}
      <div className="w-full flex flex-col items-center justify-between mb-8">
        <BackButton />
        <NavButton />
      </div>
      <div className="w-full max-w-7xl mx-auto px-8 py-2 flex flex-col gap-3">
        {/* Navigation Header */}

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Activity Logs</h1>
          <p className="text-slate-500 text-sm mt-1">
            View and search through patient activity history
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center justify-between sm:justify-end">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm"
            />
            <span className="text-slate-400 font-medium">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm font-medium"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-4 px-1">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredLogs.length}
          </span>{" "}
          logs
        </p>

        {/* Logs List */}
        <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {log.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      <span
                        className={`font-medium ${log.role === "DOCTOR" ? "text-blue-600" : "text-red-600"}`}
                      >
                        {log.role}
                      </span>
                      {" • "}
                      {log.formattedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-full transition-colors"
                    title="View Details"
                  >
                    <FaEye className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>No logs found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedLog && creator && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 "
          onClick={() => setSelectedLog(null)}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`h-28 ${headerColors[creator.themeColor]} relative`}
            >
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Profile Image & Name */}
            <div className="px-6 flex flex-col items-center mt-14 relative z-10 gap-2">
              <div className="h-28 w-28 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center shadow-md overflow-hidden">
                {creator.photo ? (
                  <img
                    src={creator.photo}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserMd className="text-4xl text-slate-400" />
                )}
              </div>

              <h3 className="mt-3 text-xl font-bold text-slate-800 text-center">
                {creator.name}
              </h3>
              <span
                className={`mt-1 px-3 py-1 text-xs font-medium border rounded-full ${badgeColors[creator.themeColor]}`}
              >
                {creator.role}
              </span>
            </div>

            {/* Modal Details */}
            <div className="p-6 space-y-4 flex flex-col gap-3">
              {creator.details.map(
                (d, i) =>
                  d.value && (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                        {d.icon}
                      </div>
                      <div className="overflow-hidden mt-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">
                          {d.label}
                        </p>
                        <p className="text-sm font-medium text-slate-700 break-words">
                          {d.value}
                        </p>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
