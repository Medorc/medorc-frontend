import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar";
import { useNavigate } from "react-router-dom";
import NavButton from "../../Components/NavButton";
import axios from "axios";

import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { FaSearch } from "react-icons/fa";
import BackButton from "../../Components/BackButton";

export default function Logs() {
  const url = "http://localhost:3000/api/v1/patient/profile";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { token, schcode } = useAuth();


  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !schcode) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/data-logs?sch_code=${schcode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            role: "patient",
          },
        });
        // Ensure data is always an array
       
        const rawLogs = res.data.data.data_logs || "";
        // Split into an array by comma
        const logs = rawLogs
          .split(",")
          .map((log) => log.trim())
          .filter((log) => log.length > 0);

        setData(logs);

      } catch (err) {
        toast.error(
          "API Error: " + (err.response?.data?.message || err.message)
        );
        setData([]); // fallback to empty array on error
      }
    };
    fetchData();
  }, [token, schcode]);

  // Filter logs by search
  const filteredLogs = data.filter((log) =>
    log.toLowerCase().includes(search.toLowerCase())
  );

   if(!token){
    navigate("/");
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <NavBar />

      {/* Header */}
      <BackButton/>

      <NavButton />

      {/* Search Bar */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-8 gap-4 mb-2 ">
      <div className="w-full max-w-3xl flex items-center mt-8 gap-4 mb-2 border rounded-full px-3  bg-white">
        <input
          type="text"
          className="  px-6 py-2 w-full text-gray-700"
          placeholder="Search for keywords or dates"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ml-[-40px] text-gray-500">
          <FaSearch />
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm mb-4 ">
        Your last {filteredLogs.length} logs will be stored here
      </div>

      {/* Logs List */}
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-8">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="border rounded px-3 py-2 bg-white">
              {log}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">No logs found.</div>
        )}
      </div>

      
      </div>
    </div>
  );
}
