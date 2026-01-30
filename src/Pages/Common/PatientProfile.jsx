import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PersonalDetails from "../../Components/PesonalDetails";
import {
  Activity,
  Cigarette,
  Wine,
  AlertTriangle,
  Dna,
  Coffee,
  ArrowLeft,
  HeartPulse,
  Baby,
} from "lucide-react";

export default function PatientProfile() {
  const url = "http://localhost:3000";

  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role || (!qr_code && !shc_code)) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${url}/api/v1/patient/profile/personal`, {
          params: { qr_code, shc_code },
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data?.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [role, qr_code, shc_code, token]);

  const LifestyleItem = ({ label, value, icon: Icon, colorClass }) => (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        value
          ? `bg-white border-${colorClass}-200 shadow-sm`
          : "bg-slate-50 border-slate-100 opacity-60"
      }`}
    >
      <div
        className={`p-3 rounded-full flex-shrink-0 ${
          value ? `bg-${colorClass}-50 text-${colorClass}-600` : "bg-slate-200 text-slate-400"
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p
          className={`font-semibold ${
            value ? "text-slate-800" : "text-slate-500"
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-slate-400">{value ? "Active" : "None"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center w-full min-h-screen pt-8 pb-20 px-4 md:px-8">
          <div className="w-full max-w-5xl flex flex-col gap-8">
            
            {/* 1. HEADER SECTION (Aligned Left with Back Button) */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm group"
                aria-label="Go back"
              >
                <ArrowLeft
                  size={20}
                  className="text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-transform"
                />
              </button>

              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Patient Profile
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  Comprehensive Health Overview & History
                </p>
              </div>
            </div>

            {user ? (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 2. PERSONAL DETAILS (Full Width Card) */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                   <PersonalDetails data={user} />
                </div>

                {/* 3. LIFESTYLE & HISTORY SECTION */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                  
                  {/* Section Title */}
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Lifestyle & History
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Habits, pregnancy status, and medical alerts
                      </p>
                    </div>
                  </div>

                  {/* Lifestyle Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <LifestyleItem
                      label="Smoking"
                      value={user?.smoking}
                      icon={Cigarette}
                      colorClass="orange"
                    />
                    <LifestyleItem
                      label="Alcohol"
                      value={user?.alcoholism}
                      icon={Wine}
                      colorClass="purple"
                    />
                    <LifestyleItem
                      label="Tobacco"
                      value={user?.tobacco}
                      icon={Coffee}
                      colorClass="amber"
                    />
                    <LifestyleItem
                      label="Exercise"
                      value={user?.exercise}
                      icon={HeartPulse}
                      colorClass="green"
                    />
                    <LifestyleItem
                      label="Pregnancy"
                      value={user?.pregnancy}
                      icon={Baby}
                      colorClass="pink"
                    />
                  </div>

                  {/* Notes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Other Habits */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Dna size={16} className="text-blue-500" /> Other Habits
                      </label>
                      <div className="w-full p-5 bg-slate-50/80 border border-slate-200 rounded-2xl min-h-[120px] text-slate-600 text-sm leading-relaxed shadow-inner">
                        {user?.others || "No other habits recorded."}
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        Allergies
                      </label>
                      <div className="w-full p-5 bg-red-50/40 border border-red-100 rounded-2xl min-h-[120px] text-slate-700 text-sm leading-relaxed shadow-inner">
                        {user?.allergy || "No known allergies."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Dna size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">
                  No Patient Data Found
                </h3>
                <p className="text-slate-400">
                  Could not retrieve profile information. Please try again.
                </p>
                <button 
                  onClick={() => navigate(-1)}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}