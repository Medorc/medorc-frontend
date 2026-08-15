import { useState, useEffect } from "react";

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";
import Loading from "../../Components/Loading";
import { FiX, FiEye } from "react-icons/fi";
import { Stethoscope, Building2, FileText, FlaskConical } from "lucide-react";
import { Badge } from "../../Components/ui/Badge";

import { API_BASE_URL } from "../../config/api";

const tabs = ["General", "Treatment", "Procedures", "Documents"];

const SectionHeading = ({ children }) => (
  <h2 className="mb-6 border-l-4 border-primary pl-3 font-display text-sm font-black uppercase tracking-wider text-foreground">
    {children}
  </h2>
);

const InfoField = ({ label, children, className = "" }) => (
  <div className={`flex flex-col p-2 ${className}`}>
    <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle">{label}</span>
    <span className="text-base font-semibold text-foreground">{children || "N/A"}</span>
  </div>
);

export default function RecordView() {
  const { record_id } = useParams();
  const [searchParams] = useSearchParams();

  const shc_code = searchParams.get("shc_code");
  const qr_code = searchParams.get("qr_code");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [hospitalization, setHospitalization] = useState(null);
  const [surgery, setSurgery] = useState(null);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    if (!token || !record_id) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const recordRes = await axios.post(
          `${API_BASE_URL}/patient/records`,
          {
            searchOptions: { sort_by: "Time Desc", entry_type: "All" },
            searchQuery: "",
            shc_code,
            qr_code,
          },
          { headers }
        );

        const currentRecord = recordRes.data?.data?.find((r) => r.record_id === record_id);
        if (!currentRecord) throw new Error("Record not found");
        setRecord(currentRecord);

        const [hospRes, surgRes, docRes] = await Promise.allSettled([
          currentRecord.is_hospitalized
            ? axios.get(`${API_BASE_URL}/patient/records/${record_id}/hospitalization`, { headers })
            : Promise.reject(),
          currentRecord.is_surgery
            ? axios.get(`${API_BASE_URL}/patient/records/${record_id}/surgery`, { headers })
            : Promise.reject(),
          axios.get(`${API_BASE_URL}/patient/records/${record_id}/documents`, { headers }),
        ]);
        if (hospRes.status === "fulfilled") setHospitalization(hospRes.value.data);
        if (surgRes.status === "fulfilled") setSurgery(surgRes.value.data);
        if (docRes.status === "fulfilled") setDocuments(docRes.value.data);
      } catch (error) {
        console.error("Failed to load record details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [record_id, token, shc_code, qr_code]);

  if (loading) return <Loading />;
  if (!record) return <p className="p-10 text-center text-muted">Record not found.</p>;

  const entryType = record.entry_type || "";
  const entryTone = entryType.includes("Doctor")
    ? "doctor"
    : entryType.includes("Hospital")
      ? "hospital"
      : "neutral";

  const DocLink = ({ href, icon: Icon, title, accentClass, className = "" }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all hover:border-primary hover:bg-primary-soft ${className}`}
    >
      <Icon size={28} className={accentClass} aria-hidden="true" />
      <p className="font-bold text-foreground group-hover:text-primary">{title}</p>
      <p className="text-xs text-subtle">Click to view file</p>
    </a>
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-background font-sans">
      <NavBar />

      <div className="relative mb-12 mt-8 w-full max-w-5xl rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-lg p-2 text-subtle transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <FiX size={26} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="mb-8 pr-10">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {record.diagnosis_name}
            </h1>
            <Badge tone={entryTone}>{entryType}</Badge>
            <span className="flex items-center gap-1 text-xs font-semibold text-success" title="Visible">
              <FiEye size={14} aria-hidden="true" /> Visible
            </span>
          </div>
          <p className="py-1 text-sm font-medium text-subtle">Detailed medical record information</p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex rounded-xl bg-surface-hover p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-surface text-foreground shadow-card"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === "General" && (
          <div className="animate-fade-in pt-4">
            <section className="mb-12">
              <SectionHeading>Basic Information</SectionHeading>
              <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3">
                <InfoField label="Entry Type">{record.entry_type}</InfoField>
                <InfoField label="Appointment Date">
                  {record.appointment_date
                    ? new Date(record.appointment_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </InfoField>
                <InfoField label="Registration No">{record.reg_no || "N/A"}</InfoField>
              </div>
            </section>

            <div className="mb-12 h-px w-full bg-border" />

            <section>
              <SectionHeading>Healthcare Provider</SectionHeading>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="flex flex-col p-2">
                  <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle">
                    Doctor Name
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    Dr. {record.doctor_name || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col p-2">
                  <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-subtle">
                    Hospital
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {record.hospital_name || "N/A"}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Treatment */}
        {activeTab === "Treatment" && (
          <div className="animate-fade-in flex flex-col gap-4 pt-4">
            <div>
              <h2 className="mb-4 pb-2 font-display text-sm font-black uppercase tracking-wider text-foreground">
                History of present illness
              </h2>
              <div className="rounded-xl border border-border bg-surface-hover p-4 italic leading-relaxed text-muted">
                "{record.history_of_present_illness || "No history logged."}"
              </div>
            </div>
            <div>
              <h2 className="mb-4 pb-2 font-display text-sm font-black uppercase tracking-wider text-foreground">
                Treatment Undergone
              </h2>
              <div className="rounded-xl border border-border bg-surface-hover p-4 leading-relaxed text-muted">
                {record.treatment_undergone || "Ongoing observation."}
              </div>
            </div>
          </div>
        )}

        {/* Procedures */}
        {activeTab === "Procedures" && (
          <div className="animate-fade-in grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
            {hospitalization ? (
              <div className="h-fit rounded-xl border border-warning/25 bg-warning-soft/40 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-warning" aria-hidden="true" />
                  <h3 className="font-bold text-warning">Hospitalization Details</h3>
                </div>
                <div className="space-y-3 text-sm text-muted">
                  <p>
                    <span className="text-subtle">Duration:</span> {hospitalization.duration}
                  </p>
                  <p>
                    <span className="text-subtle">Room No:</span> {hospitalization.room_no}
                  </p>
                  <p>
                    <span className="text-subtle">Reason:</span> {hospitalization.reason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-border bg-surface-hover p-6">
                <p className="text-sm italic text-subtle">No hospitalization records found.</p>
              </div>
            )}

            {surgery ? (
              <div className="h-fit rounded-xl border border-info/25 bg-info-soft/40 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Stethoscope size={18} className="text-info" aria-hidden="true" />
                  <h3 className="font-bold text-info">Surgery Details</h3>
                </div>
                <div className="space-y-3 text-sm text-muted">
                  <p>
                    <span className="text-subtle">Type:</span> {surgery.type}
                  </p>
                  <p>
                    <span className="text-subtle">Duration:</span> {surgery.duration}
                  </p>
                  <p>
                    <span className="text-subtle">Outcome:</span> {surgery.outcome}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-border bg-surface-hover p-6">
                <p className="text-sm italic text-subtle">No surgical records found.</p>
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        {activeTab === "Documents" && (
          <div className="animate-fade-in grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            {documents?.prescriptions ? (
              <DocLink
                href={documents.prescriptions}
                icon={FileText}
                title="Prescription Document"
                accentClass="text-primary"
              />
            ) : null}
            {documents?.lab_results ? (
              <DocLink
                href={documents.lab_results}
                icon={FlaskConical}
                title="Lab Reports"
                accentClass="text-success"
              />
            ) : null}
            {!documents?.prescriptions && !documents?.lab_results && (
              <p className="col-span-2 py-10 text-center text-subtle">No documents found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
