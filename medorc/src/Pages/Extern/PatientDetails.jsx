import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";


export default function PatientDetails() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code");
  const BASE_URL = "http://localhost:3000";

  // State
  const [data, setData] = useState({ profile: null, emergency: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!qr_code || !token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [profileRes, emergencyRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/patient/profile/personal`, {
            params: { qr_code },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/v1/patient/profile/emergency-contacts`, {
            params: { qr_code },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log(profileRes.data.data);
        console.log(emergencyRes.data.data);
        setData({
          profile: profileRes.data.data,
          emergency: emergencyRes.data.data.patient_emergency_contacts || [],
        });
        console.log("------------------");
        console.log(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load patient information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, qr_code]);

  // --- Render Helpers ---

  // Helper for the "Label: [Box]" rows on the left
  const InputRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="text-black font-medium w-32 shrink-0">{label}:</label>
      <div className="w-full border border-black rounded px-3 py-2 bg-white text-black h-10 flex items-center">
        {value || "N/A"}
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error || !data.profile) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-12 ">
      <NavBar />

      {/* Top Section with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-8">
        <BackButton showTitle={false} />

        {/* Warning Text Centered */}
        <div className="text-center mt-4 mb-8">
          <p className="text-black font-medium text-sm md:text-base">
            Since the user has turned off their visibility, you will need to
            contact them to turn it back on.
          </p>
        </div>

        {/* --- Card 1: Personal Details --- */}
        <div className="bg-white border border-gray-400 rounded-xl p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-[#4A82B3] text-xl font-medium mb-6">
            Personal Details
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Column 1: Basic Inputs (Name, DOB, Gender) */}
            <div className="flex-1 flex flex-col gap-5">
              <InputRow label="Full Name" value={data.profile.full_name} />
              <InputRow
                label="Date of birth"
                value={data.profile.date_of_birth}
              />
              <InputRow label="Gender" value={data.profile.gender} />
            </div>

            {/* Column 2: Address (Label on top, large box below) */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-black font-medium">Address</label>
              <div className="w-full border border-black rounded px-4 py-3 bg-white text-black h-32 lg:h-full flex items-start">
                {data.profile.address || "No address provided"}
              </div>
            </div>

            {/* Column 3: Profile Image */}
            <div className="flex justify-center lg:justify-end items-center lg:w-48">
              <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-[#5EEAD4] overflow-hidden shrink-0">
                {data.profile.profile_picture ? (
                  <img
                    src={data.profile.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Img
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 2: Emergency Contacts --- */}
        <div className="bg-white border border-gray-400 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-[#4A82B3] text-xl font-medium mb-6">
            Emergency contacts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.emergency && data.emergency.length > 0 ? (
              data.emergency.map((contact, index) => (
                <div
                  key={index}
                  className="border border-gray-500 p-4 rounded bg-white"
                >
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    {/* Row 1 */}
                    <span className="font-bold text-black">Full name:</span>
                    <span className="text-black truncate">
                      {contact.full_name || "N/A"}
                    </span>

                    {/* Row 2 */}
                    <span className="font-bold text-black">Phone no:</span>
                    <span className="text-black">
                      {contact.phone_no || "N/A"}
                    </span>

                    {/* Row 3 */}
                    <span className="font-bold text-black">Relation:</span>
                    <span className="text-black">
                      {contact.relation || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                No emergency contacts found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



// Simple Error Component
const ErrorState = ({ error }) => (
  <div className="min-h-screen bg-[#F5F7FA]">
    <NavBar />
    <div className="px-8 mt-6">
      <BackButton showTitle={false} />
    </div>
    <div className="flex justify-center items-center h-[60vh]">
      <p className="text-red-500 text-lg">{error || "No details found."}</p>
    </div>
  </div>
);
