import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "/profile/settings", label: "Personal Profile" },
    { id: "/security", label: "Account & Security" },
    { id: "/emergency", label: "Emergency Contacts" },
    { id: "/logs", label: "Activity Logs" },
  ];

  const handleTabClick = (tabId) => {
    navigate(tabId);
  };

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-[35px] py-3 sm:py-4" role="tablist">
        {tabs.map((tab) => {
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
