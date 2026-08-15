
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import { User, Lock, PhoneCall, History } from "lucide-react";

export default function NavButton() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = role ? role.toLowerCase() : "";

  const tabs = [
    {
      id: "/profile",
      label: "Personal Profile",
      icon: User,
      access: { patient: true, doctor: true, extern: true, hospital: true },
    },
    {
      id: "/security",
      label: "Account & Security",
      icon: Lock,
      access: { patient: true, doctor: true, extern: true, hospital: true },
    },
    {
      id: "/emergency",
      label: "Emergency Contacts",
      icon: PhoneCall,
      access: { patient: true, doctor: false, extern: false, hospital: false },
    },
    {
      id: "/logs",
      label: "Activity Logs",
      icon: History,
      access: { patient: true, doctor: false, extern: false, hospital: false },
    },
  ];

  const handleTabClick = (tabId) => {
    navigate(`/${userRole}${tabId}`);
  };

  const isTabActive = (tabId) => {
    return location.pathname.startsWith(`/${userRole}${tabId}`);
  };

  const visibleTabs = tabs.filter((tab) => tab.access[userRole]);

  return (
    <div className="w-full px-4">
      <div
        role="tablist"
        aria-label="Settings sections"
        className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-border bg-surface/70 p-1.5 shadow-card backdrop-blur"
      >
        {visibleTabs.map((tab) => {
          const active = isTabActive(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                active ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-xl bg-primary-soft -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <tab.icon size={15} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
