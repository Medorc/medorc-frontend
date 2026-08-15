import { useState, useEffect } from "react";

import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Loading from "../../Components/Loading";
import { useAuth } from "../../Context/AuthContext";
import { PageHeader } from "../../Components/PageHeader";
import { EmptyState } from "../../Components/ui/EmptyState";
import { Button } from "../../Components/ui/Button";
import PersonalDetails from "../../Components/PersonalDetails";
import {
  Dna,
  Activity,
  Cigarette,
  Wine,
  AlertTriangle,
  Coffee,
  HeartPulse,
  Baby,
} from "lucide-react";

import { API_BASE_URL } from "../../config/api";

const toneMap = {
  orange: {
    soft: "bg-warning-soft text-warning",
  },
  purple: {
    soft: "bg-info-soft text-info",
  },
  amber: {
    soft: "bg-primary-soft text-primary",
  },
  green: {
    soft: "bg-success-soft text-success",
  },
  pink: {
    soft: "bg-danger-soft text-danger",
  },
};

export default function PatientProfile() {
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
        const res = await axios.get(`${API_BASE_URL}/patient/profile/personal`, {
          params: { qr_code, shc_code },
          headers: { Authorization: `Bearer ${token}` },
        });

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

  const LifestyleItem = ({ label, value, icon: Icon, colorClass }) => {
    const active = !!value;
    return (
      <div
        className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
          active
            ? "border-border bg-surface shadow-card"
            : "border-transparent bg-surface-hover opacity-60"
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            active ? toneMap[colorClass].soft : "bg-surface text-subtle"
          }`}
        >
          <Icon size={20} aria-hidden="true" />
        </div>
        <div>
          <p className={`font-semibold ${active ? "text-foreground" : "text-muted"}`}>{label}</p>
          <p className="text-xs text-subtle">{active ? "Active" : "None"}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex min-h-screen w-full justify-center px-4 pb-20 pt-8 md:px-8">
          <div className="flex w-full max-w-5xl flex-col gap-8">
            <PageHeader
              title="Patient Profile"
              description="Comprehensive Health Overview & History"
              back
              className="mb-2"
            />

            {user ? (
              <div className="flex animate-fade-in-down flex-col gap-8">
                <PersonalDetails data={user} />

                {/* Lifestyle & History */}
                <section className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
                  <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
                    <div className="rounded-xl bg-danger-soft p-2.5 text-danger">
                      <Activity size={24} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Lifestyle & History
                      </h3>
                      <p className="text-sm text-muted">
                        Habits, pregnancy status, and medical alerts
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <LifestyleItem label="Smoking" value={user?.smoking} icon={Cigarette} colorClass="orange" />
                    <LifestyleItem label="Alcohol" value={user?.alcoholism} icon={Wine} colorClass="purple" />
                    <LifestyleItem label="Tobacco" value={user?.tobacco} icon={Coffee} colorClass="amber" />
                    <LifestyleItem label="Exercise" value={user?.exercise} icon={HeartPulse} colorClass="green" />
                    <LifestyleItem label="Pregnancy" value={user?.pregnancy} icon={Baby} colorClass="pink" />
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Dna size={16} className="text-primary" aria-hidden="true" /> Other Habits
                      </p>
                      <div className="min-h-[120px] rounded-2xl border border-border bg-surface-hover p-5 text-sm leading-relaxed text-muted">
                        {user?.others || "No other habits recorded."}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <AlertTriangle size={16} className="text-danger" aria-hidden="true" /> Allergies
                      </p>
                      <div className="min-h-[120px] rounded-2xl border border-danger/20 bg-danger-soft/40 p-5 text-sm leading-relaxed text-muted">
                        {user?.allergy || "No known allergies."}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-surface shadow-card">
                <EmptyState
                  icon={Dna}
                  title="No Patient Data Found"
                  description="Could not retrieve profile information. Please try again."
                  action={
                    <Button variant="outline" onClick={() => navigate(-1)}>
                      Go Back
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
