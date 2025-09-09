import React, { useState } from "react";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Personal Profile"  },
    { id: "security", label: "Account & Security" },
    { id: "contacts", label: "Emergency Contacts" },
    { id: "logs", label: "Activity Logs"},
  ];

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-center gap-40 space-x-8  py-4 ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab.id
                  ? "bg-[#4A90E2] text-white shadow"
                  : "text-black hover:text-[#4A90E2]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      
    </div>
  );
}
