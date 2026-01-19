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
    <div className="w-full h-16 flex items-center justify-center relative px-4 sm:px-8">
      <button
        className="absolute left-4 sm:left-8 bg-[#4A82B3] py-1 px-4 sm:px-7 text-white cursor-pointer font-bold rounded "
        onClick={() => Navigate(`/${role}/home`)}
      >
        <FaArrowLeft className="inline mr-2 text-lg sm:text-xl" /> Back
      </button>
      {showTitle && (
        <h1 className="font-medium text-xl sm:text-2xl md:text-3xl text-[#0751A7]">
          {title}
        </h1>
      )}
    </div>
  );
}
