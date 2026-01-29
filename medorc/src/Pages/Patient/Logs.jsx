import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import NavButton from "../../Components/NavButton";
import BackButton from "../../Components/BackButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { FaSearch } from "react-icons/fa";

export default function Logs() {
  const url = "http://localhost:3000/api/v1/patient/profile";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { token, shc_code } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !shc_code) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/data-logs?sch_code=${shc_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const rawLogs = res.data?.data?.data_logs || "";

        const logs = rawLogs
          .split(",")
          .map((log) => log.trim())
          .filter((log) => log.length > 0);

        setData(logs);
      } catch (err) {
        toast.error(
          "API Error: " + (err.response?.data?.message || err.message)
        );
        setData([]);
      }
    };

    fetchData();
  }, [token, shc_code]);

  const filteredLogs = data.filter((log) =>
    log.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <NavBar />

      <BackButton />
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <NavButton />

        {/* Page Title */}
        <div className="mt-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Activity Logs</h1>
          <p className="text-slate-500 text-sm">
            View and search through patient activity history
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keyword or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Log Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredLogs.length}
            </span>{" "}
            logs
          </p>
        </div>

        {/* 📜 Logs List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 ">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-center items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 mt-2 rounded-full bg-blue-500"></div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {log}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-lg font-semibold text-slate-700">
                No Logs Found
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Try adjusting your search or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
