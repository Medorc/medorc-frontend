import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PersonalDetails from "../../Components/PesonalDetails";  // 🔥 Fixed import

export default function PatientBasicDetails() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code");

  const BASE_URL = "http://localhost:3000";

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
  }, [token, qr_code]); // 🔥 removed shc_code

  if (loading) return <Loading />;
  if (error || !data.profile) return <ErrorState error={error} />;

  const visibilityOff = data.profile?.visibility === false; // 🔥 show warning only if needed

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
        <div className="w-full max-w-7xl bg-white border border-gray-400 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-[#4A82B3] text-xl font-medium mb-6">
            Emergency Contacts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.emergency.length > 0 ? (
              data.emergency.map((contact, index) => (
                <div key={index} className="border border-gray-500 p-4 rounded bg-white">
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <span className="font-bold">Full name:</span>
                    <span className="truncate">{contact.full_name || "N/A"}</span>

                    <span className="font-bold">Phone no:</span>
                    <span>{contact.phone_no || "N/A"}</span>

                    <span className="font-bold">Relation:</span>
                    <span>{contact.relation || "N/A"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                No emergency contacts available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 Better to place here
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
