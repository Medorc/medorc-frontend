import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


export default function BackButton() {
    const Navigate = useNavigate();
    return (
    <div className="w-full h-16 flex items-center justify-center relative px-4 sm:px-8">
            <button className="absolute left-4 sm:left-8 bg-[#4A82B3] py-1 px-4 sm:px-7 text-white cursor-pointer font-bold rounded " onClick={()=>Navigate('/home')}>
              <FaArrowLeft className="inline mr-2 text-lg sm:text-xl"  /> Back
            </button>
            <h1 className="font-medium text-xl sm:text-2xl md:text-3xl text-[#0751A7]">
              Profile & Settings
            </h1>
    </div>
  )
}
