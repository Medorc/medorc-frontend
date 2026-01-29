import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

export default function Tabs() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = role ? role.toLowerCase() : "";

  const tabs = [
    {
      id: "/profile",
      label: "Personal Profile",
      access: { patient: true, doctor: true, extern: true, hospital: true },
    },
    {
      id: "/security",
      label: "Account & Security",
      access: { patient: true, doctor: true, extern: true, hospital: true },
    },
    {
      id: "/emergency",
      label: "Emergency Contacts",
      access: { patient: true, doctor: false, extern: false, hospital: false },
    },
    {
      id: "/logs",
      label: "Activity Logs",
      access: { patient: true, doctor: false, extern: false, hospital: false },
    },
  ];

  const handleTabClick = (tabId) => {
    navigate(`/${userRole}${tabId}`);
  };

  const isTabActive = (tabId) => {
    return location.pathname.startsWith(`/${userRole}${tabId}`);
  };

  // Filter valid tabs for current role to ensure proper layout
  const visibleTabs = tabs.filter((tab) => tab.access[userRole]);

  return (
    <div className="w-full flex justify-center py-6">
      <div className="bg-white/50 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 shadow-sm">
        {visibleTabs.map((tab) => {
          const active = isTabActive(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              role="tab"
              aria-selected={active}
              className={`relative px-6 py-2.5 text-sm md:text-base font-semibold rounded-xl transition-colors duration-200 z-10 ${
                active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white shadow-md border border-slate-100 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
