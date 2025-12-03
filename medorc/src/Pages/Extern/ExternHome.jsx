import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import Loading from "../../Components/Loading";
import { FaSearch, FaTimes } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ExternHome() {
  const url = "http://localhost:3000";
  const navigate = useNavigate();

  const { token, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/extern/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (token) {
      getuser();
    }
  }, [token]);

  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      setScanResult(code);
      setIsScanning(false);
      navigate(`/PatientDetails?qr_code=${code}`);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (scanResult) {
      navigate(`/PatientDetails?shc_code=${scanResult}`);
    }
    setLoading(false);
  };

  const handleError = (error) => {
    console.error(error);
    setLoading(false);
  };

  if(!token){
    navigate("/login");
  }

  if(role !== "extern"){
    navigate("/login");
  }
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-[#0751A7] text-center mb-8">
              Dashboard
            </h1>

          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border p-8 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Left Section: Name and Email */}
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium text-black">
                  {user.full_name}
                </h2>
                <p className="text-gray-600 text-sm font-medium">
                  {user.email}
                </p>
                <div className="mt-4">
                  <button className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer shadow-sm" onClick={()=>navigate("/externprofile")}>
                    View Profile
                  </button>
                </div>
              </div>

              {/* Middle Section: Organization */}
              <div className="flex flex-col self-start md:self-center mt-2 md:mt-0">
                <p className="text-black font-medium text-sm">
                  {user.org_name}
                </p>
                <p className="text-black font-medium text-sm">LIC pvt. ltd</p>
              </div>

              {/* Right Section: Profile Placeholder */}
              <div className="self-start md:self-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Access Panel */}
          <div className="bg-white rounded-xl border p-10 shadow-sm relative">
            <h3 className="text-[#4A82B3] font-medium text-lg mb-8">
              Quick Access Panel
            </h3>

            {scanResult && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md border border-green-200">
                <strong>Scanned Result:</strong> {scanResult}
                <button
                  onClick={() => setScanResult(null)}
                  className="ml-4 text-sm underline hover:text-green-900 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Search Section */}
              <div className="border border-gray-400 p-8 flex flex-col items-center justify-center gap-4">
                <input
                  type="text"
                  placeholder="Search with SHC code"
                  value={scanResult || ""}
                  onChange={(e) => setScanResult(e.target.value)}
                  className="w-full max-w-xs border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-[#4A90E2]"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#5c8bc0] hover:bg-[#4a7ab0] text-white px-8 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FaSearch /> Search
                </button>
              </div>

              {/* QR Section */}
              <div className="border border-gray-400 p-8 flex items-center justify-center gap-8">
                <div className="bg-gray-200 p-1">
                  <QRCodeCanvas value="https://medorc.in" size={100} />
                </div>
                <button
                  onClick={() => setIsScanning(true)}
                  className="bg-[#5c8bc0] hover:bg-[#4a7ab0] text-white px-8 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer shadow-sm"
                >
                  Scan QR
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      )}

      {/* Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-xl m-4">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-2 right-2 z-10 p-2 text-gray-600 hover:text-gray-900 bg-white rounded-full shadow-md"
            >
              <FaTimes size={20} />
            </button>
            <div className="overflow-hidden rounded-lg">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                components={{
                  audio: false,
                  onOff: false,
                  torch: false,
                  zoom: false,
                  finder: true,
                }}
                styles={{
                  container: { width: "100%" },
                }}
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
