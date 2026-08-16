import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Loading } from "./Loading";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  FiSearch,
  FiX,
  FiGrid,
  FiChevronRight,
  FiLogOut,
  FiCheck,
  FiCamera,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const ROLE_TONES = {
  doctor: {
    label: "Doctor",
    tone: "doctor",
    gradient: "from-teal-700 via-teal-600 to-cyan-600",
    iconBg: "bg-doctor-soft text-doctor",
    ring: "ring-doctor/40",
  },
  hospital: {
    label: "Hospital",
    tone: "hospital",
    gradient: "from-indigo-700 via-indigo-600 to-violet-600",
    iconBg: "bg-hospital-soft text-hospital",
    ring: "ring-hospital/40",
  },
  extern: {
    label: "External",
    tone: "extern",
    gradient: "from-amber-700 via-amber-600 to-orange-600",
    iconBg: "bg-extern-soft text-extern",
    ring: "ring-extern/40",
  },
};

export default function UserCard({ user, role, navigate, token }) {
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [shcCode, setShcCode] = useState("");
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    if (isScanning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isScanning]);

  const meta = ROLE_TONES[role] || ROLE_TONES.doctor;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const routeByVisibility = (code, codeKey) => {
    navigate(`/${role}/records?${codeKey}=${code}`);
  };

  const routeByProfile = (code, codeKey) => {
    navigate(`/${role}/PatientBasicDetails?${codeKey}=${code}`);
  };

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      if (!code) return;

      setIsScanning(false);
      setQrResult(code);
      setLoading(true);
      setScanError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/patient/profile`, {
          params: { qr_code: code },
          headers: { Authorization: `Bearer ${token}` },
        });

        const visibility = response?.data?.visibility;

        if (visibility) {
          routeByVisibility(code, "qr_code");
        } else {
          routeByProfile(code, "qr_code");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setScanError("Could not find a patient for this QR code.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!shcCode) return;
    setLoading(true);
    setScanError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/patient/profile`, {
        params: { shc_code: shcCode },
        headers: { Authorization: `Bearer ${token}` },
      });

      const visibility = response?.data?.visibility;

      if (visibility) {
        routeByVisibility(shcCode, "shc_code");
      } else {
        routeByProfile(shcCode, "shc_code");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setScanError("Could not find a patient with that SHC code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl animate-fade-in px-4 pb-16 pt-8 sm:px-6">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${meta.gradient}`}>
                  {meta.label} Dashboard
                </span>
              </h1>
              <p className="mt-1 text-lg text-muted">
                Welcome back,{" "}
                <span className="font-semibold text-foreground">
                  {role === "doctor" || role === "extern"
                    ? user?.full_name || meta.label
                    : user?.name || meta.label}
                </span>
                .
              </p>
            </div>

            <Button variant="danger-soft" onClick={handleLogout} icon={FiLogOut}>
              Logout
            </Button>
          </div>

          {/* Profile card */}
          <section
            aria-label="Your profile"
            className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-card"
          >
            <div
              aria-hidden="true"
              className={`absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br ${meta.gradient} opacity-[0.08] blur-3xl`}
            />

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="relative shrink-0">
                  <div className={`rounded-full p-1 ring-2 ${meta.ring}`}>
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-surface bg-surface-hover">
                      <img src={user?.photo || "/image.png"} alt="Profile" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <span
                    className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-surface bg-success"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5 md:items-start">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {user?.full_name || user?.name || meta.label}
                  </h2>

                  {role === "doctor" && (
                    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                      {user?.specializations && (
                        <Badge tone="doctor">{user.specializations}</Badge>
                      )}
                      {user?.years_of_experience != null && (
                        <Badge tone="success">{user.years_of_experience} Years Exp.</Badge>
                      )}
                    </div>
                  )}

                  {user?.blood_group && (
                    <Badge tone="danger">Blood Group: {user.blood_group}</Badge>
                  )}

                  <p className="text-sm text-muted">{user?.email}</p>

                  <span className="inline-flex items-center gap-1.5 self-center rounded-full bg-surface-hover px-3 py-1 text-xs font-medium text-muted md:self-start">
                    <FiGrid size={12} aria-hidden="true" />
                    {role === "hospital" || role === "extern"
                      ? `${user?.name || meta.label} • LIC Pvt. Ltd`
                      : user?.hospital_affiliation || "No affiliation"}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/${role}/profile`)}
                icon={FiChevronRight}
              >
                View Profile
              </Button>
            </div>
          </section>

          {/* Quick access label */}
          <div className="flex items-center gap-3">
            <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${meta.gradient}`} aria-hidden="true" />
            <h3 className="font-display text-xl font-bold text-foreground">Quick Access</h3>
          </div>

          {/* Scanned result alert */}
          {qrResult && (
            <div className="animate-fade-in-down flex items-center justify-between gap-4 rounded-xl border border-success-soft bg-success-soft px-5 py-4 text-success">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                  <FiCheck size={13} aria-hidden="true" />
                </div>
                <span className="font-medium">Scanned: {qrResult}</span>
              </div>
              <button
                type="button"
                onClick={() => setQrResult("")}
                className="text-sm font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {scanError && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-danger-soft bg-danger-soft px-5 py-4 text-danger">
              <span className="font-medium">{scanError}</span>
              <button
                type="button"
                onClick={() => setScanError("")}
                className="text-sm font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Action cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Patient search */}
            <section
              aria-label="Find patient records"
              className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-2xl ${meta.iconBg}`}>
                <FiSearch size={26} aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Find Patient Records</h3>
              <p className="mb-4 text-sm text-muted">
                Enter the unique SHC code to access history instantly.
              </p>
              <form
                className="relative w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <input
                  type="text"
                  placeholder="Enter SHC Code"
                  aria-label="SHC code"
                  value={shcCode}
                  onChange={(e) => setShcCode(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background pl-4 pr-24 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!shcCode.trim()}
                  className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2"
                >
                  Search
                </Button>
              </form>
            </section>

            {/* QR verification */}
            <section
              aria-label="QR verification"
              className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-2xl ${meta.iconBg}`}>
                <FiCamera size={26} aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">QR Verification</h3>
              <p className="mb-6 text-sm text-muted">
                Tap below to scan a patient's digital ID or prescription.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsScanning(true)}
                icon={FiCamera}
              >
                Launch Scanner
              </Button>
            </section>
          </div>
        </div>
      )}

      {/* Scanner overlay */}
      {isScanning &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animate-fade-in">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setIsScanning(false)}
              aria-label="Back to dashboard"
              className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
            >
              <FiArrowLeft size={18} aria-hidden="true" />
              <span>Back</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsScanning(false)}
              aria-label="Close scanner"
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
            >
              <FiX size={24} aria-hidden="true" />
            </button>

            <div className="mb-8 text-center text-white">
              <h2 className="font-display text-2xl font-bold">Scan QR Code</h2>
              <p className="mt-1 text-sm text-white/60">Align the QR code within the frame</p>
            </div>

            <div className="relative h-80 w-80 overflow-hidden rounded-3xl border-4 border-slate-700 bg-black shadow-2xl shadow-primary/20">
              <Scanner
                onScan={handleScan}
                components={{ finder: false }}
                styles={{ container: { width: "100%", height: "100%" } }}
              />

              {/* Corner accents */}
              <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-primary" />
              <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-primary" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-primary" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-primary" />
              <div
                className="pointer-events-none absolute left-0 h-0.5 w-full bg-primary shadow-[0_0_15px_rgba(20,184,166,1)] animate-[scan_2s_infinite_ease-in-out]"
                style={{ animation: "scan 2s infinite ease-in-out" }}
              />
            </div>

            <div className="mt-8 flex items-center gap-2 rounded-full bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300">
              <FiArrowRight size={14} aria-hidden="true" />
              Searching for code...
            </div>

            {/* Cancel button */}
            <button
              type="button"
              onClick={() => setIsScanning(false)}
              className="mt-6 rounded-xl border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-white/20 active:scale-95"
            >
              Cancel
            </button>
          </div>,
          document.body
        )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </main>
  );
}
