import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProfilePhoto from "./ProfilePhoto";

export default function ProfileChange({ data }) {
  const url = "http://localhost:3000";
  const { token, role } = useAuth();

  // local editable state
  const [profile, setProfile] = useState({
    email: data.email || "",
    phone: data.phone || "",
    password: "",
    photo: data.photo || "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const payload = {};
  const changeHandler = async (field) => {
      if(field=="email"){
        payload.newEmail = profile.email;
      }else if(field=="phone"){
        payload.newPhoneNo = profile.phone;
      }else if(field=="password"){
        payload.newPassword = profile.password;
      }

    try {
      const res = await axios.patch(
        `${url}/api/v1/${role}/profile/${field}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Updated successfully");
      
    } catch (err) {
      toast.error("API Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-6">
      {/* Photo */}
      <div className="flex justify-center items-center mt-4 md:mt-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full overflow-hidden">
          <img src={data.photo||"image.png"} className="w-full h-full object-cover" alt="profile" />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border flex flex-col items-center rounded-lg p-6 md:p-8 shadow-sm mt-6 mx-auto gap-6">

        {/* Email */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label htmlFor="email" className="font-semibold text-gray-700 w-32">Email:</label>
          <input
            id="email"
            type="email"
            className="flex-1 border-2 rounded py-1 px-4"
            name="email"
            value={profile.email}
            placeholder="Enter new email"
            onChange={handleChange}
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded"
            onClick={() => changeHandler("email")}>
            Change
          </button>
        </div>

        {/* Phone */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label htmlFor="phone" className="font-semibold text-gray-700 w-32">Phone:</label>
          <input
            id="phone"
            type="tel"
            className="flex-1 border-2 rounded py-1 px-4"
            name="phone"
            value={profile.phone}
            placeholder="Enter new phone number"
            onChange={handleChange}
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded"
            onClick={() => changeHandler("phone")}>
            Change
          </button>
        </div>

        {/* Password */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label htmlFor="password" className="font-semibold text-gray-700 w-32">Password:</label>
          <input
            id="password"
            type="password"
            className="flex-1 border-2 rounded py-1 px-4"
            placeholder="Enter new password"
            name="password"
            value={profile.password}
            onChange={handleChange}
          />
          <button className="bg-[#4A90E2] py-1 px-6 text-white font-bold rounded"
            onClick={() => changeHandler("password")}>
            Change
          </button>
        </div>

      </div>
    </div>
  );
}
