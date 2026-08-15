import { useState, useEffect } from "react";

import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import Loading from "../../Components/Loading";
import EmergencyContacts from "../../Components/EmergencyContacts";
import PersonalDetails from "../../Components/PersonalDetails";
import { ErrorState } from "../../Components/ui/ErrorState";

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
            params: { qr_code: qr_code, shc_code: shc_code },
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
  }, [token, qr_code, shc_code]);

  if (loading) return <Loading />;
  if (error || !data.profile)
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <ErrorState title="Could not load patient information" description={error || "No details found."} />
      </div>
    );

  const visibilityOff = data.profile?.visibility === false;

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <BackButton />

      <div className="mx-auto mt-6 flex w-full flex-col items-center gap-8 px-4 sm:px-8">
        {visibilityOff && (
          <p className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning-soft px-4 py-2.5 text-center text-sm font-medium text-warning">
            <FiAlertTriangle className="shrink-0" aria-hidden="true" />
            Visibility is turned off — you must contact the user to enable it.
          </p>
        )}

        <PersonalDetails data={data.profile} />
        <EmergencyContacts emergency={data.emergency} />
      </div>
    </div>
  );
}
