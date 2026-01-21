import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import { FiLogOut, FiActivity, FiClock, FiFileText, FiUser, FiSettings, FiShield, FiEye, FiEyeOff, FiTrendingUp } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const navigator = useNavigate();

  const url = "http://localhost:3000/api/v1/patient/profile";
  const { token, logout } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigator("/");
    }
  }, [token, navigator]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setData(res.data);
        localStorage.setItem("schcode", res.data.shc_code);
        setEnabled(res.data.visibility);
      } catch (err) {
        toast.error("Error fetching profile: " + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const visibility = async () => {
    try {
      const res = await axios.patch(
        `${url}/shc-visibility`,
        { curVisibility: enabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEnabled(res.data.visibility);
      toast.success(res.data.visibility ? "SHC is now visible to doctors" : "SHC is now hidden");
    } catch (err) {
      toast.error("Error updating visibility: " + (err.response?.data || err.message));
    }
  };

  const menuItems = [
    {
      label: "Medical History",
      desc: "View records & reports",
      icon: <FiFileText size={22} />,
      action: () => navigator("/patient/records"),
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      label: "My Profile",
      desc: "Manage personal details",
      icon: <FiUser size={22} />,
      action: () => navigator("/patient/profile"),
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <NavBar />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <FaHeartbeat size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {data.full_name?.split(" ")[0] || "Patient"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => navigator("/patient/records", { state: { openOrby: true } })}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Ask Orby AI
            </button>
            <button
              onClick={() => {
                logout();
                navigator("/");
              }}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border border-red-100 active:scale-95"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 pt-5">
          {/* LEFT COLUMN: Welcome & Quick Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero / Welcome Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white/10 shrink-0">
                  <img
                    src={data.photo || "/image.png"}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold mb-2">Hello, {data.full_name || "Patient"}!</h2>
                  <p className="text-blue-100 text-lg mb-4">{data.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-sm">
                      <span className="text-blue-200">Blood Group: </span>
                      <span className="font-semibold">{data.blood_group || "O+"}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-sm">
                      <span className="text-blue-200">Age: </span>
                      <span className="font-semibold">{data.age ? `${data.age} yrs` : "24 yrs"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="pb-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 pl-4 py-2">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left flex items-start gap-4 group"
                  >
                    <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.label}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Health Tip */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 ">
              <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                <FiActivity size={32} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-emerald-900 mb-1">Daily Health Tip</h3>
                <p className="text-emerald-700">Drink at least 3 liters of water today to verify hydration levels and improve cognitive function.</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SHC & QR */}
          <div className="space-y-8">
            {/* SHC Card Widget */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
              <div className="bg-gray-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-emerald-400" size={24} />
                    <span className="font-bold tracking-wider">MEDORC SHC</span>
                  </div>
                  <img src="/Logo.png" alt="Medorc" className="h-6 opacity-50 grayscale invert" />
                </div>
                <div className="mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">SHC Code</p>
                  <p className="font-mono text-2xl tracking-widest text-emerald-400 drop-shadow-md">
                    {data.shc_code || "LOADING..."}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                    <QRCodeCanvas
                      value={data.qr_code || "no-code-available"}
                      size={160}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-2">Scan to access medical records</p>
                </div>

                {/* Visibility Toggle */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700 text-sm flex items-center gap-2">
                      {enabled ? <FiEye className="text-emerald-500" /> : <FiEyeOff className="text-gray-400" />}
                      Doctor Access
                    </span>
                    <div
                      onClick={!loading ? visibility : undefined}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? "bg-emerald-500" : "bg-gray-300"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-0"}`}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {enabled
                      ? "Your SHC is currently visible to authorized doctors."
                      : "Your SHC is hidden. Doctors cannot access your records."}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mt-6">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <FiTrendingUp />
                What is SHC?
              </h4>
              <p className="text-sm text-blue-700/80 leading-relaxed">
                Secure Health Card (SHC) is your digital health passport. It allows instant, secure sharing of your medical history with doctors via QR code.
                <button className="block mt-2 text-blue-600 font-bold hover:underline text-xs">Learn More →</button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
