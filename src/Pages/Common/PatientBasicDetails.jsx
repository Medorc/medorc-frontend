import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import EmergencyContacts from "../../Components/EmergencyContacts";
import PersonalDetails from "../../Components/PersonalDetails";

import { API_BASE_URL } from "../../config/api";

export default function PatientBasicDetails() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const [data, setData] = useState({ profile: null, emergency: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileRes, emergencyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/patient/profile/personal`, {
            params: { qr_code: qr_code, shc_code: shc_code},
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/patient/profile/emergency-contacts`, {
            params: { qr_code: qr_code, shc_code: shc_code },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        
        setData({
          profile: profileRes.data.data,
          emergency: emergencyRes.data.data.patient_emergency_contacts || [],
        });
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load patient information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, qr_code]); 

  if (loading) return <Loading />;
  if (error || !data.profile) return <ErrorState error={error} />;

  const visibilityOff = data.profile?.visibility === false; 

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] pb-12">
      <NavBar />
      <BackButton />

      <div className="w-full mx-auto px-4 sm:px-8 mt-6 flex flex-col gap-8 items-center">

        {visibilityOff && (
          <p className="text-black font-medium text-sm md:text-base text-center">
            Visibility is turned off — you must contact the user to enable it.
          </p>
        )}

        <PersonalDetails data={data.profile} />

        {/* Emergency Contacts */}

       <EmergencyContacts emergency={data.emergency} />
      </div>
    </div>
  );
}


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
