import React, { useEffect } from "react";
import NavBar from "../../Components/NavBar";
import { FaArrowLeft } from "react-icons/fa6";
import NavButton from "../../Components/NavButton";

import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";


export default function Account() {
  const [data, setData] = useState({
    email:"",
    phone_no:"",
    password:""
  });
  const { token } = useAuth();

    const url="http://localhost:3000/api/v1/patient/profile";

    useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(url+"/basic", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        setData(res.data.data);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [token]);

  const changehandler=async ()=>{
    try{
        const res =await axios.patch(url,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

      })
    }catch (err){
        toast.error("API Error: " + (err.response?.data || err.message));
    }

    
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center ">
      <NavBar />

      {/* Header */}
      <div className="w-full h-16 flex items-center justify-center relative px-4 sm:px-8">
        <button className="absolute left-4 sm:left-8 bg-[#4A82B3] py-1 px-4 sm:px-7 text-white font-bold rounded" onClick={()=>Navigate('/home')}>
          <FaArrowLeft className="inline mr-2 text-lg sm:text-xl" /> Back
        </button>
        <h1 className="font-medium text-xl sm:text-2xl md:text-3xl text-[#0751A7]">
          Profile & Settings
        </h1>
      </div>

      <NavButton />

      {/* Profile Image */}
      <div className="flex justify-center items-center mt-4 md:mt-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full overflow-hidden">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.JflGW8e1fT4_ttSuFTQXJwHaHj?pid=Api&P=0&h=220"
            className="w-full h-full object-cover"
            alt="profile"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-3xl bg-white border flex flex-col items-center rounded-lg p-6 md:p-8 shadow-sm mt-6 mx-auto gap-6">
        {/* Email */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label
            htmlFor="email"
            className="text-sm sm:text-base font-semibold text-gray-700 w-32"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            className="flex-1 border-2 rounded py-1 px-4"
            name="email"
            value={data.email || ""}
            
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded" onClick={changehandler}>
            Change
          </button>
        </div>

        {/* Phone */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label
            htmlFor="phone"
            className="text-sm sm:text-base font-semibold text-gray-700 w-32"
          >
            Phone:
          </label>
          <input
            id="phone"
            
            type="tel"
            className="flex-1 border-2 rounded py-1 px-4"
            name="phone_no"
            value={data.phone_no || ""}
            
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded">
            Change
          </button>
        </div>

        {/* Password */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label
            htmlFor="password"
            className="text-sm sm:text-base font-semibold text-gray-700 w-32"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={data.password || ""}
            className="flex-1 border-2 rounded py-1 px-4"
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
