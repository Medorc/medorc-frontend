import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PersonalDetails from "../../Components/PesonalDetails";
import { FaPencilAlt } from "react-icons/fa";

export default function PatientProfile() {
  const url = "http://localhost:3000";

  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role || (!qr_code && !shc_code)) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${url}/api/v1/patient/profile/personal`,
          {
            params: { qr_code, shc_code },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data?.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [role, qr_code, shc_code, token]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full mx-auto px-4 py-8 sm:px-8 mt-6 flex flex-col gap-8 items-center">
          <h1 className="text-3xl font-bold text-[#0751A7] text-center">
            User Profile
          </h1>

          {user ? (
            <div className="w-full flex flex-col gap-6 items-center">
              {/* Personal Details */}
              <PersonalDetails data={user} />

              {/* Lifestyle */}
              <div className="w-full max-w-7xl bg-white border rounded-lg p-4 sm:p-6 shadow-sm relative flex flex-col gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0751A7]">
                  Lifestyle
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Habits */}
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "smoking", label: "Smoking" },
                      { key: "alcoholism", label: "Alcoholism" },
                      { key: "tobacco", label: "Tobacco" },
                      { key: "exercise", label: "Exercise habit" },
                      { key: "pregnancy", label: "Pregnancy" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={Boolean(user?.[key])}
                          readOnly
                        />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Other Habits */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">
                      Other habits (if any)
                    </label>
                    <textarea
                      className="border-2 rounded px-3 py-2 w-full h-24 resize-none"
                      value={user?.others || "--"}
                      readOnly
                    />
                  </div>

                  {/* Allergies */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">
                      Allergies (if any)
                    </label>
                    <textarea
                      className="border-2 rounded px-3 py-2 w-full h-24 resize-none"
                      value={user?.allergy || "--"}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No patient data found.
            </p>
          )}

          <button
            className="bg-[#4A90E2] py-2 px-6 text-white font-bold rounded"
            onClick={() => navigate(-1)}
          >
            Back To Record
          </button>
        </div>
      )}
    </div>
  );
}
