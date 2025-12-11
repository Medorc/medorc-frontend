import React, { useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function UserCard({ user, role, navigate, token }) {
  const url = "http://localhost:3000";

  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [qrResult, setQrResult] = useState(""); // QR scanned value
  const [shcCode, setShcCode] = useState("");   // Input search value

  
  // -----------------------------
  // QR CODE SCANNING
  // -----------------------------
  const handleScan = async (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const code = detectedCodes[0].rawValue;
    setQrResult(code);
    setIsScanning(false);
    setLoading(true);

    try {
      const response = await axios.get(`${url}/api/v1/patient/profile`, {
        params: { qr_code: code },
        headers: { Authorization: `Bearer ${token}` },
      });

      const visibility = response?.data?.visibility;

      if (visibility) {
        navigate(`/${role}/patientrecords?qr_code=${code}`);
      } else {
        navigate(`/${role}/PatientBasicDetails?qr_code=${code}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SEARCH USING SHC CODE
  // -----------------------------
  const handleSearch = async () => {
    if (!shcCode) return;

    setLoading(true);

    try {
      const response = await axios.get(`${url}/api/v1/patient/profile`, {
        params: { shc_code: shcCode },
        headers: { Authorization: `Bearer ${token}` },
      });

      const visibility = response?.data?.visibility;

      if (visibility) {

        navigate(`/${role}/patientrecords?shc_code=${shcCode}`);
      } else {
        navigate(`/${role}/PatientBasicDetails?shc_code=${shcCode}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center w-full">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-[#0751A7] text-center mb-8">
              Dashboard
            </h1>

            {/* USER PROFILE CARD */}
            <div className="bg-white rounded-xl border p-8 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Left user details */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-medium text-black">
                    {user?.full_name}
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">
                    {user?.email}
                  </p>
                  <div className="mt-4">
                    <button
                      className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-2 rounded-full text-sm font-medium shadow-sm"
                      onClick={() => navigate(`/${role}/profile`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                {/* ORG */}
                {role !== "hospital" && (
                  <div className="flex flex-col items-start md:items-center mt-2 md:mt-0">
                    <p className="text-black font-medium text-sm">{user?.org_name}</p>
                    <p className="text-black font-medium text-sm">LIC pvt. ltd</p>
                  </div>
                )}

                {/* Profile Photo */}
                <div>
                  <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                    <img
                      src={user?.photo || "image.png"}
                      className="w-full h-full object-cover"
                      alt="profile"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACCESS PANEL */}
            <div className="bg-white rounded-xl border p-10 shadow-sm relative">
              <h3 className="text-[#4A82B3] font-semibold text-xl mb-8">
                Quick Access Panel
              </h3>

              {qrResult && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 flex justify-between items-center">
                  <strong>Scanned Result:</strong> {qrResult}
                  <button
                    onClick={() => setQrResult("")}
                    className="ml-4 text-sm underline hover:text-green-900"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SEARCH INPUT */}
                <div className="border border-gray-400 p-8 flex flex-col items-center justify-center gap-4">
                  <input
                    type="text"
                    placeholder="Search with SHC code"
                    value={shcCode}
                    onChange={(e) => setShcCode(e.target.value)}
                    className="w-full max-w-xs border border-gray-400 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-[#5c8bc0] hover:bg-[#4a7ab0] text-white px-8 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2"
                  >
                    <FaSearch /> Search
                  </button>
                </div>

                {/* QR SCAN */}
                <div className="border border-gray-400 p-8 flex flex-col items-center justify-center gap-6">
                  <div className="bg-gray-200 p-1">
                    <QRCodeCanvas value="https://medorc.in" size={100} />
                  </div>
                  <button
                    onClick={() => setIsScanning(true)}
                    className="bg-[#5c8bc0] hover:bg-[#4a7ab0] text-white px-10 py-2 rounded-full text-sm font-medium shadow-sm"
                  >
                    Scan QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCANNER OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-xl m-4">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900 bg-white rounded-full shadow-md"
            >
              <FaTimes size={20} />
            </button>

            <div className="overflow-hidden rounded-lg">
              <Scanner
                onScan={handleScan}
                onError={() => setLoading(false)}
                components={{
                  audio: false,
                  onOff: false,
                  torch: false,
                  zoom: false,
                  finder: true,
                }}
                styles={{ container: { width: "100%" } }}
              />
            </div>

            <p className="text-center mt-4 text-gray-600 font-medium">
              Point camera at a QR code
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
