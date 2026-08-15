import { useState, useEffect } from "react";

import axios from "axios";
import NavBar from "../../Components/NavBar";
import { FiSearch, FiCalendar, FiFileText, FiPlus, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import RecordCard from "../../Components/RecordCard";
import OrbyChat from "../../Components/OrbyChat";
import { API_BASE_URL } from "../../config/api";
import { Button } from "../../Components/ui/Button";
import { Avatar } from "../../Components/ui/Avatar";
import { Card } from "../../Components/ui/Card";
import { EmptyState } from "../../Components/ui/EmptyState";
import { Skeleton } from "../../Components/ui/Skeleton";

const ENTRY_TYPES = ["All", "Hospital", "Doctor", "Self"];

export default function Records() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entryType, setEntryType] = useState("All");
  const [sortBy, setSortBy] = useState("Time Desc");
  const [records, setRecords] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, shc_code, profileData } = useAuth();
  const activeProfile = userProfile || profileData;

  const [showOrbyChat, setShowOrbyChat] = useState(location.state?.openOrby || false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const payload = {
          searchOptions: { sort_by: sortBy, entry_type: entryType },
          shc_code: shc_code || profileData?.shc_code,
          searchQuery: searchTerm,
        };

        const res = await axios.post(`${API_BASE_URL}/patient/records`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) setRecords(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm, entryType, sortBy, shc_code, profileData?.shc_code, token]);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/patient/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleOrbyBack = () => {
    if (location.state?.openOrby) {
      const fromPath = location.state?.from || "/patient/home";
      navigate(fromPath, { replace: true });
    } else {
      setShowOrbyChat(false);
    }
  };

  if (showOrbyChat) {
    return (
      <OrbyChat
        userName={activeProfile?.full_name || "User"}
        onBack={handleOrbyBack}
        shcCode={activeProfile?.shc_code || shc_code}
        qrCode={activeProfile?.qr_code}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={activeProfile?.photo} name={activeProfile?.full_name} size={64} />
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Medical Records
              </h1>
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">
                  {activeProfile?.full_name || "Patient"}
                </span>{" "}
                • SHC: {activeProfile?.shc_code || shc_code || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              icon={FiArrowLeft}
              onClick={() => navigate("/patient/home")}
            >
              Back
            </Button>
            <Button icon={FiPlus} onClick={() => navigate("/patient/addrecord")}>
              Add Record
            </Button>
            <Button
              variant="primarySoft"
              icon={FiMessageCircle}
              onClick={() => setShowOrbyChat(true)}
            >
              Ask Orby
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <div className="relative flex-1">
                <FiSearch
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Search records"
                  placeholder="Search records by diagnosis, doctor, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-subtle transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <FiCalendar className="text-subtle" aria-hidden="true" />
                <select
                  aria-label="Sort records"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 cursor-pointer bg-transparent pr-2 text-sm font-medium text-foreground outline-none"
                >
                  <option value="Time Desc">Newest First</option>
                  <option value="Time Asc">Oldest First</option>
                  <option value="Diagnosis">Diagnosis (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by entry type">
              {ENTRY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={entryType === type}
                  onClick={() => setEntryType(type)}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    entryType === type ? "text-white" : "text-muted hover:bg-surface-hover"
                  }`}
                >
                  {entryType === type && (
                    <motion.span
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{type === "All" ? "All Records" : type}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Records list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </>
          ) : records.length ? (
            records.map((r) => <RecordCard key={r.record_id} record={r} />)
          ) : (
            <Card>
              <EmptyState
                icon={FiFileText}
                title="No records found"
                description="Try adjusting your search or add a new record to get started."
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
