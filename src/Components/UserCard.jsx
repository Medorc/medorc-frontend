import React, { useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import {
  FaSearch,
  FaTimes,
  FaQrcode,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

// ✅ NEW MODULE IMPORT
import { Scanner } from "@yudiel/react-qr-scanner";

// import { useAuth } from "../Context/AuthContext"; // Uncomment if available

export default function UserCard({ user, role, navigate, token }) {
  const url = "http://localhost:3000";

  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [shcCode, setShcCode] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };



  // -----------------------------
  // QR CODE SCANNING (Updated for @yudiel/react-qr-scanner)
  // -----------------------------
  const handleScan = async (detectedCodes) => {
    // This library returns an array of detected objects
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue; // Access the raw string

      if (!code) return;

      setIsScanning(false);
      setQrResult(code);
      setLoading(true);

      try {
        const response = await axios.get(`${url}/api/v1/patient/profile`, {
          params: { qr_code: code },
          headers: { Authorization: `Bearer ${token}` },
        });

        const visibility = response?.data?.visibility;

        if (visibility) {
          navigate(`/${role}/patientrecords?qr_code=${code}`);
        } else {
          navigate(`/${role}/PatientBasicDetails?qr_code=${code}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!shcCode) return;

    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/v1/patient/profile`, {
        params: { shc_code: shcCode },
        headers: { Authorization: `Bearer ${token}` },
      });

      const visibility = response?.data?.visibility;

      if (visibility) {
        navigate(`/${role}/patientrecords?shc_code=${shcCode}`);
      } else {
        navigate(`/${role}/PatientBasicDetails?shc_code=${shcCode}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center w-full min-h-screen p-4 md:p-8">
          <div className="w-full max-w-6xl flex flex-col gap-8">
            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
                    {role === "doctor" ? "Doctor" : ""} Dashboard
                  </span>
                </h1>
                <p className="text-slate-500 text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold text-slate-700">
                    {user?.full_name || "Doctor"}
                  </span>
                  .
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-300 font-medium border border-red-100"
              >
                <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                Logout
              </button>
            </div>

            {/* 2. PROFILE CARD */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                        <img
                          src={user?.photo || "image.png"}
                          className="w-full h-full object-cover"
                          alt="profile"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {user?.full_name}
                    </h2>
                    {role === "doctor" && (
                      <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          {user?.specializations}
                        </span>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          {user?.years_of_experience} Years Exp.
                        </span>
                      </div>
                    )}
                    <p className="text-slate-400 text-sm mb-3">{user?.email}</p>

                    {(role === "hospital" || role === "extern") && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 self-center md:self-start">
                        🏢 {user?.org_name} • LIC Pvt. Ltd
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/${role}/profile`)}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 flex items-center gap-2"
                >
                  View Profile <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* QUICK ACCESS LABEL */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-800">Quick Access</h3>
            </div>

            {/* 3. SCANNED RESULT ALERT */}
            {qrResult && (
              <div className="animate-fade-in-down bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  <span className="font-medium">Scanned: {qrResult}</span>
                </div>
                <button
                  onClick={() => setQrResult("")}
                  className="text-sm font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* 4. CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A: Patient Search */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-2 group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Find Patient Records
                </h3>
                <p className="text-slate-500 text-sm mb-8">
                  Enter the unique SHC code to access history instantly.
                </p>
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder="Enter SHC Code"
                    value={shcCode}
                    onChange={(e) => setShcCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors shadow-md"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Card B: QR Verification */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  <FaQrcode />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  QR Verification
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Tap below to scan a patient's digital ID or prescription.
                </p>

                <div className="mb-6 p-2 bg-white border border-slate-100 rounded-xl shadow-sm opacity-60 grayscale group-hover:grayscale-0 transition-all">
                  <QRCodeCanvas value="https://medorc.in" size={60} />
                </div>

                <button
                  onClick={() => setIsScanning(true)}
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3"
                >
                  <FaQrcode /> Launch Scanner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCANNER OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setIsScanning(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-50"
          >
            <FaTimes size={24} />
          </button>

          <div className="text-white text-center mb-8">
            <h2 className="text-2xl font-bold">Scan QR Code</h2>
            <p className="text-white/60 text-sm mt-1">
              Align the QR code within the frame
            </p>
          </div>

          <div className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border-4 border-slate-700 bg-black">
            {/* ✅ NEW SCANNER COMPONENT */}
            <Scanner
              onScan={handleScan}
              // We disable the default 'finder' border so we can use our custom one below
              components={{ finder: false }}
              styles={{ container: { width: "100%", height: "100%" } }}
            />

            {/* CUSTOM OVERLAY (Preserved from your design) */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl pointer-events-none"></div>
            <div className="absolute left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_infinite_ease-in-out] z-10 pointer-events-none"></div>
          </div>

          <p className="mt-8 text-sm text-slate-400 font-medium bg-slate-800/50 px-4 py-2 rounded-full">
            Searching for code...
          </p>
        </div>
      )}
    </div>
  );
}
