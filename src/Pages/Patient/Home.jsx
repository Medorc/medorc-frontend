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
  const [showShcInfo, setShowShcInfo] = useState(false);
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
    if (!token) return;

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
        console.error("Profile fetch error:", err);
        const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        // Avoid showing toast on 401/403 which might happen during logout race conditions
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          toast.error("Error fetching profile: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const [healthTip, setHealthTip] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setFade(false); // Start fade out
        setTimeout(async () => {
          const res = await axios.get("http://localhost:3000/api/v1/health-tips/random");
          if (res.data?.healthTip) {
            setHealthTip(res.data.healthTip);
          }
          setFade(true); // Fade in
        }, 500); // Wait for fade out
      } catch (err) {
        console.error("Error fetching health tip:", err);
        setFade(true); // Ensure visible even on error
      }
    };

    fetchTip(); // Initial fetch
    const interval = setInterval(fetchTip, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

      setEnabled(res.data.data.visibility);
      toast.success(res.data.data.visibility ? "SHC is now visible to doctors" : "SHC is now hidden");
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 pt-12">
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
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 min-h-[120px]">
              <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 shrink-0 animate-pulse">
                <FiActivity size={32} />
              </div>
              <div className={`text-center md:text-left transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-lg font-bold text-emerald-900 mb-1">
                  Daily Health Tip {healthTip?.category ? <span className="text-emerald-600 text-xs bg-emerald-100 px-2 py-0.5 rounded-full ml-2 uppercase">{healthTip.category}</span> : null}
                </h3>
                <p className="text-emerald-700">
                  {healthTip?.tip_text || "Loading health tips for you..."}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SHC & QR */}
          <div className="flex flex-col gap-4">
            {/* SHC Card Widget */}
            {/* SHC Card Widget */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
              <div className="bg-gray-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-emerald-400" size={24} />
                    <span className="font-bold tracking-wider ">MEDORC SHC</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShcInfo(true);
                      }}
                      className="ml-1 text-gray-400 hover:text-white transition-colors"
                      title="What is SHC?"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <img src="/Logo.png" alt="Medorc" className="h-6 opacity-50 grayscale invert" />
                </div>
                <div className="mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 pt-2">SHC Code</p>
                  <p className="font-mono text-xl tracking-widest text-emerald-400 drop-shadow-md">
                    {data.shc_code || "LOADING..."}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white flex flex-col gap-1">
                <div className="flex justify-center mb-8">
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

            {/* SHC INFO MODAL */}
            {showShcInfo && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                onClick={() => setShowShcInfo(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative transform transition-all scale-100"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowShcInfo(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>

                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FiTrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">What is SHC?</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">Secure Health Card (SHC)</span> is your digital health passport. It acts as a unique identifier for your medical history.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                      <p className="text-sm text-gray-600 flex gap-2">
                        <span className="text-green-500">✔</span> Instant sharing via QR code
                      </p>
                      <p className="text-sm text-gray-600 flex gap-2">
                        <span className="text-green-500">✔</span> Secure doctor access control
                      </p>
                      <p className="text-sm text-gray-600 flex gap-2">
                        <span className="text-green-500">✔</span> Centralized medical history
                      </p>
                    </div>
                    <button
                      onClick={() => setShowShcInfo(false)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/20"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
