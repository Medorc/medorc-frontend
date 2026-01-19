import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecordCard from "../../Components/RecordCard";

/* ================= MAIN PAGE ================= */
export default function PatientRecord() {
  const url = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [entryType, setEntryType] = useState("All");
  const [sortBy, setSortBy] = useState("Time Desc");
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);

  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const navigate = useNavigate();
  const { token, role } = useAuth();

  // Fetch records (depends on search filters)
  useEffect(() => {
    if (!role) return;

    const fetchRecords = async () => {
      try {
        const payload = {
          searchOptions: {
            sort_by: sortBy,
            entry_type: entryType,
          },
          role,
          searchQuery: searchTerm,
          qr_code,
          shc_code,
        };

        const res = await axios.post(`${url}/api/v1/patient/records`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecords(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchRecords();
  }, [searchTerm, entryType, sortBy, role, token, qr_code, shc_code]);
  // Fetch user profile (depends only on codes)

  useEffect(() => {
    if (!role || (!qr_code && !shc_code)) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/patient/profile`, {
          params: { qr_code, shc_code },
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [role, qr_code, shc_code, token]);

  return (
    <div className="min-h-screen  bg-gray-50">
      <NavBar />

      <main className="w-full mx-auto px-4 py-8 space-y-6 flex flex-col gap-6">
        {/* Header */}
        <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#50E3C2]">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-gray-600">
                  {user?.full_name?.[0]}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0751A7]">
                Medical Records
              </h1>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  {user?.full_name}
                </span>{" "}
                • SHC: {user?.shc_code || "N/A"}
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
            {role != "extern" && (
              <button
                className="px-6 py-2.5 rounded-lg bg-[#4A90E2] text-white text-sm font-semibold hover:bg-[#4A90E2]/80"
                onClick={() =>
                  navigate(
                    `/${role}/addrecord?qr_code=${qr_code}&shc_code=${shc_code}`
                  )
                }
              >
                Add Record
              </button>
            )}
            <button
              className="px-6 py-2.5 rounded-lg bg-[#4A90E2] text-white text-sm font-semibold hover:bg-[#4A90E2]/80"
              onClick={() => navigate(`/${role}/patientprofile?qr_code=${qr_code}&shc_code=${shc_code}`)}
            >
              User Profile
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-[#4A90E2] text-white text-sm font-semibold hover:bg-[#4A90E2]/80"
              onClick={() => navigate(`/${role}/askorby`)}
            >
              Ask Orby
            </button>
          </div>
        </div>

        {/* Filters */}
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
            </select>

            <select
              className="h-11 min-w-[160px] border border-gray-200 rounded-lg px-4 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Time Desc">Newest First</option>
              <option value="Time Asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Records */}
        <div className="space-y-4">
          {records.length ? (
            records.map((r) => (
              <RecordCard key={r.id || r.record_id} record={r} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No records found</p>
          )}
        </div>
      </main>
    </div>
  );
}
