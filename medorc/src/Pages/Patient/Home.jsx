import React, { useContext } from "react";
import { useState,useEffect } from "react";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import {QRCodeCanvas} from 'qrcode.react';

export default function Home() {

  const [text, setText] = useState("https://example.com");
  const { token } = useAuth();
  
useEffect(() => {
    // It's good practice to define the async function inside useEffect
    const fetchProfile = async () => {
      // Make sure you actually have a token before making the call
      if (!token) {
        console.log("No token found, skipping API call.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/v1/patient/profile", {
          headers: {
            // 3. Use backticks (`) for the Authorization header.
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log("Profile Data:", res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);



  const [enabled, setEnabled] = useState(false);
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavBar />
      <div className="h-15 w-full flex bg-white justify-center py-2">
        <h1 className="font-semibold text-3xl">Health Dashboard</h1>
      </div>

      <div className="w-full h-40 flex justify-between items-center p-10 gap-10">
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-3xl">Arun K</h2>
          <p className="font-medium">arunk.pt@medorc.in</p>
          <button className="bg-sky-500 py-1 rounded-full px-4 font-medium text-white hover:bg-sky-600 transition">
            View Profile
          </button>
        </div>

        {/* Right Section */}
        <div className="profile flex justify-center w-30 h-30 items-center bg-white border-3 border-green-500 rounded-full shadow-md p-2">
          <img src="/profile.png" width="150px" alt="Profile" />
        </div>
      </div>
      <div className=" w-full flex flex-col">
        {/* Charts Section */}
        <div className="w-full flex gap-10 justify-center  bg-sky-500 p-2 ">
          <p className="text-white font-medium">
            Health tip: Drink atleast 3 litres of water{" "}
          </p>
        </div>
        <div
          className="bg-(url('/PHBG.png')) w-full h-30 flex justify-center items-center"
          style={{ backgroundImage: "url('/PHBG.png')" }}
        ></div>
      </div>
      <div className=" w-full h-15 flex flex-col justify-center items-center">
        <button className="bg-sky-500 py-2 rounded-full px-4 font-medium text-white hover:bg-sky-600 transition">
          View Full Medical History
        </button>
      </div>
      <div className="w-full bg-white h-55 justify-between items-center flex p-10">
        <div className="w-150 gap-4 flex flex-col">
          <h3 className="mb-3 font-semibold text-lg">
            Access Control Settings
          </h3>

          {/* Line 1: SHC Visibility + Toggle */}
          <div className="flex items-center gap-4 mb-3">
            <label className="font-medium">SHC Visibility:</label>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
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

          {/* Line 2: SHC Code */}
          <div className="flex items-center gap-4 mb-3">
            <label className="font-medium">SHC Code:</label>
            <span className="px-3 py-1 border border-gray-400 rounded bg-gray-50 text-gray-800">12345678</span>
          </div>

          {/* Info Text */}
          <p className="text-normol text-blue-800">
            Not sure what SHC is? Click here to learn more about your Secure
            Health Card (SHC) and how it helps manage your health data securely.
          </p>
        </div>

        <div className="qr">
          <QRCodeCanvas value="https://reactjs.org/" />
        </div>
      </div>
    </div>
  );
}
