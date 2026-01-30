import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function BackButton({
  title = "Profile & Settings",
  showTitle = true,
}) {
  const Navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="w-full h-20 flex items-center justify-center relative px-4 sm:px-8 bg-transparent">
      <button
        className="absolute left-4 sm:left-8 group flex items-center gap-2 px-5 py-2.5 bg-white text-[#4A82B3] hover:bg-[#4A82B3] hover:text-white shadow-[0_4px_14px_0_rgba(74,130,179,0.15)] hover:shadow-[0_6px_20px_0_rgba(74,130,179,0.3)] border border-[#4A82B3]/10 hover:border-[#4A82B3] rounded-full transition-all duration-300 ease-out sm:text-base text-sm font-semibold tracking-wide"
        onClick={() => Navigate(`/${role}/home`)}
      >
        <FaArrowLeft className="text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {showTitle && (
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-[#0751A7] tracking-tight drop-shadow-sm">
          {title}
        </h1>
      )}
    </div>
  );
}
