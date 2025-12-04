import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const navigator = useNavigate();

  const url = "http://localhost:3000/api/v1/patient/profile";
  const { token } = useAuth();
  const [data, setData] = useState({});

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigator("/");
    }
  }, [token, navigator]);

  // Fetch profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setData(res.data);
        localStorage.setItem("schcode", res.data.shc_code);
        setEnabled(res.data.visibility);
      } catch (err) {
        toast.error("Error fetching profile: " + (err.response?.data || err.message));
      }
    };

    fetchProfile();
  }, [token]);

  const visibility = async () => {
    try {
      const res = await axios.patch(
        `${url}/shc-visibility`,
        { curVisibility: enabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEnabled(res.data.visibility);
      toast.success("Visibility updated successfully");
    } catch (err) {
      toast.error("Error updating visibility: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavBar />

      {/* Header */}
      <div className="h-15 w-full flex bg-white justify-center py-2">
        <h1 className="font-semibold text-2xl md:text-3xl text-center">
          Health Dashboard
        </h1>
      </div>

      {/* Profile Section */}
      <div className="w-full flex flex-col md:flex-row cursor-pointer justify-between items-center py-2 px-4 md:py-3 md:px-6 gap-3">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h2 className="font-semibold text-base md:text-xl lg:text-2xl leading-tight">
            {data.full_name}
          </h2>
          <p className="font-medium text-xs md:text-sm lg:text-base leading-tight">
            {data.email}
          </p>
          <button
            className="bg-sky-500 py-1 px-3 md:px-5 cursor-pointer rounded-full font-medium text-white hover:bg-sky-600 transition text-xs md:text-sm"
            onClick={() => navigator("/patient/profile")}
          >
            View Profile
          </button>
        </div>

        <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#4AE3C7] rounded-full overflow-hidden">
          <img
            src={data.photo || "/image.png"}
            className="w-full h-full object-cover"
            alt="profile"
          />
        </div>
      </div>

      {/* Tip Section */}
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-center bg-sky-500 p-2">
          <p className="text-white font-medium text-sm md:text-base">
            Health tip: Drink at least 3 litres of water
          </p>
        </div>
        <div
          className="w-full h-20 md:h-30 bg-cover bg-center flex justify-center items-center"
          style={{ backgroundImage: "url('/PHBG.png')" }}
        ></div>
      </div>

      {/* Medical History Button */}
      <div className="w-full flex justify-center items-center my-4">
        <button className="bg-sky-500 py-2 rounded-full px-6 font-medium text-white hover:bg-sky-600 transition">
          View Full Medical History
        </button>
      </div>

      {/* Access Control Section */}
      <div className="w-full bg-white flex flex-col lg:flex-row justify-between items-center p-6 md:p-10 gap-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Access Control Settings</h3>

          {/* SHC Visibility */}
          <div className="flex items-center gap-4">
            <label className="font-medium">SHC Visibility:</label>
            <button
              onClick={visibility}
              className={`w-14 h-7 flex items-center  rounded-full p-1 transition-colors duration-300 ${
                enabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  enabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* SHC Code */}
          <div className="flex items-center gap-4">
            <label className="font-medium">SHC Code:</label>
            <span className="px-3 py-1 border border-gray-400 rounded bg-gray-50 text-gray-800 text-sm md:text-base">
              {data.shc_code}
            </span>
          </div>

          <p className="text-sm md:text-base text-blue-800">
            Not sure what SHC is? Click here to learn more about your Secure
            Health Card (SHC) and how it helps manage your health data securely.
          </p>
        </div>

        {/* QR Code */}
        <div className="qr flex justify-center">
          <QRCodeCanvas
            value={data.qr_code || "no-code-available"}
            size={150}
            className="md:size-128"
          />
        </div>
      </div>
    </div>
  );
}
