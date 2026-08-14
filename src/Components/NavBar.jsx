import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, ShieldCheck, ChevronDown } from "lucide-react";

export default function NavBar() {
  const { user, role, profileData, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleColor = () => {
    switch (role) {
      case "patient":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "doctor":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "hospital":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "extern":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getProfilePath = () => {
    if (!role) return "/";
    return `/${role}/profile`;
  };

  const getSecurityPath = () => {
    if (!role) return "/";
    return `/${role}/security`;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Platform Name */}
        <div
          onClick={() => navigate(role ? `/${role}/home` : "/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/Logo.png"
            alt="Medorc Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-lg text-slate-800 tracking-tight leading-tight">
              MEDORC
            </span>
            <span className="text-[10px] font-semibold text-blue-600 tracking-widest uppercase">
              Health Orchestrator
            </span>
          </div>
        </div>

        {/* Right Controls: Role Badge & Profile Menu */}
        {role && (
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleColor()}`}
            >
              <ShieldCheck size={14} />
              {role}
            </span>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition duration-200 border border-slate-200/60 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xs bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {profileData?.photo ? (
                    <img
                      src={profileData.photo}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(profileData?.full_name || role || "U")[0]?.toUpperCase()}</span>
                  )}
                </div>
                <ChevronDown size={16} className="text-slate-500 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {profileData?.full_name || "Medorc User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {role?.toUpperCase()} ACCOUNT
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(getProfilePath());
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                  >
                    <User size={16} className="text-blue-600" />
                    <span>Personal Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(getSecurityPath());
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                  >
                    <Settings size={16} className="text-indigo-600" />
                    <span>Account & Security</span>
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
