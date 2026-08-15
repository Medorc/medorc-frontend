import { useState, useEffect } from "react";

import axios from "axios";
import NavBar from "../../Components/NavBar";
import { FiSearch, FiCalendar, FiArrowLeft, FiUser, FiMessageCircle, FiPlus } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import RecordCard from "../../Components/RecordCard";
import OrbyChat from "../../Components/OrbyChat";
import { Button } from "../../Components/ui/Button";
import { EmptyState } from "../../Components/ui/EmptyState";
import { API_BASE_URL } from "../../config/api";

const ENTRY_TYPES = ["All", "Hospital", "Doctor", "Self"];

export default function PatientRecord() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entryType, setEntryType] = useState("All");
  const [sortBy, setSortBy] = useState("Time Desc");
  const [records, setRecords] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const location = useLocation();
  const { token, role } = useAuth();

  const [showOrbyChat, setShowOrbyChat] = useState(location.state?.openOrby || false);

  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return;

    const fetchRecords = async () => {
      try {
        const payload = {
          searchOptions: {
            sort_by: sortBy,
            entry_type: entryType,
          },
          role,
          searchQuery: searchTerm,
          qr_code,
          shc_code,
        };

        const res = await axios.post(`${API_BASE_URL}/patient/records`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecords(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchRecords();
  }, [searchTerm, entryType, sortBy, role, token, qr_code, shc_code]);

  useEffect(() => {
    if (!role || (!qr_code && !shc_code)) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/patient/profile`, {
          params: { qr_code, shc_code },
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(res.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [role, qr_code, shc_code, token]);

  const handleOrbyBack = () => {
    if (location.state?.openOrby) {
      const fromPath = location.state?.from || `/${role || "patient"}/home`;
      navigate(fromPath, { replace: true });
    } else {
      setShowOrbyChat(false);
    }
  };

  if (showOrbyChat) {
    return (
      <OrbyChat
        userName={userProfile?.full_name || "User"}
        onBack={handleOrbyBack}
        shcCode={userProfile?.shc_code || shc_code}
        qrCode={userProfile?.qr_code || qr_code}
      />
    );
  }

  const profileName = userProfile?.full_name || "Patient";
  const displayShc = userProfile?.shc_code || shc_code || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-primary/40 bg-surface-hover">
              {userProfile?.photo ? (
                <img
                  src={userProfile.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                  {profileName[0] || "U"}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Medical Records</h1>
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{profileName}</span> • SHC:{" "}
                {displayShc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" onClick={() => navigate(`/${role}/home`)}>
              <FiArrowLeft size={15} aria-hidden="true" />
              Back
            </Button>
            {role !== "extern" && (
              <Button
                onClick={() =>
                  navigate(`/${role}/addrecord?qr_code=${qr_code}&shc_code=${shc_code}`)
                }
              >
                <FiPlus size={15} aria-hidden="true" />
                Add Record
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/${role}/patientprofile?qr_code=${qr_code}&shc_code=${shc_code}`)
              }
            >
              <FiUser size={15} aria-hidden="true" />
              User Profile
            </Button>
            <Button variant="primarySoft" onClick={() => setShowOrbyChat(true)}>
              <FiMessageCircle size={15} aria-hidden="true" />
              Ask Orby
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
                <input
                  className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-foreground placeholder-muted transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25"
                  placeholder="Search records by diagnosis, doctor, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4">
                <FiCalendar className="text-muted" aria-hidden="true" />
                <select
                  className="h-12 cursor-pointer bg-transparent font-medium text-foreground focus:outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Time Desc">Newest First</option>
                  <option value="Time Asc">Oldest First</option>
                  <option value="Diagnosis">Diagnosis (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ENTRY_TYPES.map((type) => {
                const active = entryType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEntryType(type)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/25"
                        : "bg-surface-hover text-muted hover:bg-surface-hover/70 hover:text-foreground"
                    }`}
                  >
                    {type === "All" ? "All Records" : type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="flex flex-col gap-3">
          {records.length ? (
            records.map((r) => (
              <RecordCard
                key={r.record_id}
                record={r}
                shc_code={userProfile?.shc_code || shc_code}
                qr_code={userProfile?.qr_code || qr_code}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-border bg-surface shadow-card">
              <EmptyState title="No records found" description="Try adjusting your search or filters." />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
