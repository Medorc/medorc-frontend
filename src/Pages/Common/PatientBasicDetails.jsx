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

  const visibilityOff = data.profile?.visibility === false || true; // Always show warning when routed to Basic Details view

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-8">
        <BackButton />

        <div className="mt-4 space-y-6">
          {/* Prominent Restricted Access Alert Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <FiAlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-foreground">
                  Patient Record Access Restricted
                </h2>
                <p className="mt-1 text-sm text-muted">
                  The patient has turned off Doctor Access visibility. Full diagnostic medical history, prescriptions, and lab reports are currently hidden. Below are the verified basic profile and emergency contact details.
                </p>
              </div>
            </div>
          </div>

          <PersonalDetails data={data.profile} isEditing={false} />
          <EmergencyContacts emergency={data.emergency} isEditing={false} />
        </div>
      </div>
    </div>
  );
}
