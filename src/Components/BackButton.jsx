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
    <div className="w-full h-16 sm:h-20 flex items-center justify-center relative px-2 sm:px-8 bg-transparent">
      {/* Back Button */}
      <button
        className="
          absolute left-2 sm:left-8 
          group flex items-center justify-center gap-2 
          p-2 sm:px-5 sm:py-2.5 
          bg-white text-[#4A82B3] 
          hover:bg-[#4A82B3] hover:text-white 
          shadow-[0_4px_14px_0_rgba(74,130,179,0.15)] 
          hover:shadow-[0_6px_20px_0_rgba(74,130,179,0.3)] 
          border border-[#4A82B3]/10 hover:border-[#4A82B3] 
          rounded-full 
          transition-all duration-300 ease-out 
          text-sm sm:text-base font-semibold tracking-wide
          z-10
        "
        onClick={() => Navigate(`/${role}/home`)}
        aria-label="Go Back"
      >
        <FaArrowLeft className="text-base sm:text-lg transition-transform duration-300 group-hover:-translate-x-1" />
        
        {/* Hide text on mobile, show on tablet/desktop */}
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Title */}
      {showTitle && (
        <h1 className="
          font-bold 
          text-lg sm:text-2xl md:text-3xl 
          text-[#0751A7] 
          tracking-tight drop-shadow-sm 
          text-center
          px-12 sm:px-0 
          truncate max-w-full
        ">
          {title}
        </h1>
      )}
    </div>
  );
}