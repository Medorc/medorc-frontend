import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Tabs() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Safety check: Ensure role exists and is lowercase to match your keys 
  const userRole = role ? role.toLowerCase() : "";

  const tabs = [
    {
      id: "/profile/settings",
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
    if(role=="patient"){
      navigate(tabId);
    }else if(role=="doctor"){
      navigate(tabId);
    }else if(role=="extern"){
      navigate(tabId);
    }else{
      navigate(tabId);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <nav
        className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-[35px] py-3 sm:py-4"
        role="tablist"
      >
        {tabs.map((tab) => {
          // 2. Logic: Check if the current user role has access
          const hasAccess = tab.access[userRole];

          // 3. If no access, do not render the button (Standard UI Pattern)
          if (!hasAccess) return null;

          const isActive = location.pathname === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              role="tab"
              aria-selected={isActive}
              className={`px-4 sm:px-5 md:px-10 py-1 sm:py-2 rounded-full 
                text-xs sm:text-sm md:text-base font-medium transition
                ${
                  isActive
                    ? "bg-[#4A90E2] text-white shadow"
                    : "text-black hover:text-[#4A90E2] border border-transparent hover:border-[#4A90E2]"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}