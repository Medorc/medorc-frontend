import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import { FiFileText, FiUser, FiActivity, FiShield, FiEye, FiEyeOff, FiHelpCircle, FiMessageCircle } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";
import { Button } from "../../Components/ui/Button";
import { Badge } from "../../Components/ui/Badge";
import { Modal } from "../../Components/ui/Modal";
import { Toggle } from "../../Components/ui/Toggle";
import { Avatar } from "../../Components/ui/Avatar";
import { Loading } from "../../Components/Loading";

export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const [showShcInfo, setShowShcInfo] = useState(false);
  const navigate = useNavigate();

  const { token } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/patient/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setData(res.data);
        localStorage.setItem("schcode", res.data.shc_code);
        setEnabled(res.data.visibility);
      } catch (err) {
        console.error("Profile fetch error:", err);
        const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          toast.error(
            "Error fetching profile: " + (typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg)
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const [healthTip, setHealthTip] = useState({
    category: "General",
    tip_text: "Stay hydrated and get at least 7-8 hours of sleep each night.",
  });
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setFade(false);
        setTimeout(async () => {
          const res = await axios.get(`${API_BASE_URL}/health-tips/random`);
          if (res.data?.healthTip) {
            setHealthTip(res.data.healthTip);
          }
          setFade(true);
        }, 500);
      } catch (err) {
        console.error("Error fetching health tip:", err);
        setFade(true);
      }
    };

    fetchTip();
    const interval = setInterval(fetchTip, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/patient/profile/shc-visibility`,
        { curVisibility: enabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEnabled(res.data.data.visibility);
      toast.success(res.data.data.visibility ? "SHC is now visible to doctors" : "SHC is now hidden");
    } catch (err) {
      toast.error("Error updating visibility: " + (err.response?.data || err.message));
    }
  };

  const menuItems = [
    {
      label: "Medical History",
      desc: "View records & reports",
      icon: FiFileText,
      action: () => navigate("/patient/records"),
      tone: "patient",
    },
    {
      label: "My Profile",
      desc: "Manage personal details",
      icon: FiUser,
      action: () => navigate("/patient/profile"),
      tone: "hospital",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-14">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lift shadow-primary/25">
              <FaHeartbeat size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Health Dashboard
              </h1>
              <p className="text-sm text-muted">Welcome back, {data.full_name?.split(" ")[0] || "Patient"}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/patient/records", { state: { openOrby: true, from: "/patient/home" } })}
            icon={FiMessageCircle}
            size="lg"
          >
            Ask Orby AI
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Hero / Welcome */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/80 via-slate-900 to-teal-950/80 border border-teal-500/20 p-8 text-white shadow-lift">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
              />

              <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
                <Avatar
                  src={data.photo || "/image.png"}
                  name={data.full_name}
                  size={96}
                  className="border-4 border-white/20"
                />
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                    Hello, {data.full_name || "Patient"}!
                  </h2>
                  <p className="mt-1 text-teal-100/80">{data.email}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm backdrop-blur">
                      <span className="text-teal-200">Blood Group:</span>
                      <span className="font-semibold">{data.blood_group || "O+"}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm backdrop-blur">
                      <span className="text-teal-200">Age:</span>
                      <span className="font-semibold">{data.age ? `${data.age} yrs` : "24 yrs"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <section aria-labelledby="quick-actions-title">
              <h3 id="quick-actions-title" className="mb-3 px-1 font-display text-lg font-bold text-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-primary transition-transform duration-200 group-hover:scale-110">
                      <item.icon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-foreground">{item.label}</h4>
                      <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Health tip */}
            <section
              aria-live="polite"
              className="flex min-h-[116px] flex-col items-center gap-5 rounded-2xl border border-border bg-gradient-to-br from-surface to-primary-soft/40 p-6 sm:flex-row"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <FiActivity size={26} aria-hidden="true" />
              </div>
              <div className={`text-center transition-opacity duration-500 sm:text-left ${fade ? "opacity-100" : "opacity-0"}`}>
                <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h3 className="font-display text-lg font-bold text-foreground">Daily Health Tip</h3>
                  {healthTip?.category && (
                    <Badge tone="primary" className="uppercase">
                      {healthTip.category}
                    </Badge>
                  )}
                </div>
                <p className="text-muted">{healthTip?.tip_text || "Loading health tips for you..."}</p>
              </div>
            </section>
          </div>

          {/* Right column: SHC card */}
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
              {/* Card front */}
              <div className="relative overflow-hidden bg-slate-900 p-6 text-white">
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5"
                />
                <div className="relative z-10 mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-primary" size={22} aria-hidden="true" />
                    <span className="font-bold tracking-wider">MEDORC SHC</span>
                    <button
                      type="button"
                      onClick={() => setShowShcInfo(true)}
                      className="ml-0.5 text-gray-400 transition-colors hover:text-white"
                      aria-label="What is SHC?"
                    >
                      <FiHelpCircle size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <img
                    src="/Logo.png"
                    alt="Medorc"
                    className="h-6 w-auto opacity-50 grayscale invert"
                  />
                </div>
                <p className="mb-1 text-xs uppercase tracking-widest text-gray-400">SHC Code</p>
                <p className="font-mono text-xl tracking-widest text-primary drop-shadow-md">
                  {data.shc_code || "LOADING..."}
                </p>
              </div>

              {/* Card body */}
              <div className="flex flex-col gap-4 p-6">
                <div className="flex justify-center">
                  <div className="rounded-2xl border-2 border-border bg-surface p-3 shadow-card">
                    <QRCodeCanvas
                      value={data.qr_code || "no-code-available"}
                      size={160}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-muted">Scan to access medical records</p>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                      {enabled ? (
                        <FiEye className="text-success" aria-hidden="true" />
                      ) : (
                        <FiEyeOff className="text-subtle" aria-hidden="true" />
                      )}
                      Doctor Access
                    </span>
                    <Toggle
                      checked={enabled}
                      onChange={toggleVisibility}
                      label="Doctor access visibility"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted">
                    {enabled
                      ? "Your SHC is currently visible to authorized doctors."
                      : "Your SHC is hidden. Doctors cannot access your records."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={showShcInfo}
        onClose={() => setShowShcInfo(false)}
        title="What is SHC?"
        description="Your digital health passport"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            <span className="font-semibold text-foreground">Secure Health Card (SHC)</span> is your
            digital health passport. It acts as a unique identifier for your medical history.
          </p>
          <div className="space-y-2 rounded-xl border border-border bg-background p-4 text-sm text-muted">
            <p className="flex items-center gap-2">
              <span className="text-success" aria-hidden="true">✔</span> Instant sharing via QR code
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success" aria-hidden="true">✔</span> Secure doctor access control
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success" aria-hidden="true">✔</span> Centralized medical history
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => setShowShcInfo(false)}
          >
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
