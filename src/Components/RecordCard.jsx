import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiUser,
  FiTag,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";
import { Stethoscope, Building2, User } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

export default function RecordCard({ record, shc_code, qr_code }) {
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const navigate = useNavigate();

  const { token } = useAuth();

  const entryType = record.entry_type || "";
  const isDoctor = entryType.includes("Doctor");
  const isHospital = entryType.includes("Hospital");
  const isSelf = entryType.includes("Self") || (!isDoctor && !isHospital);

  const displayType = entryType.replace(" Entry", "") || "N/A";

  const [docCount, setDocCount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const fetchDocumentCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/patient/records/${record.record_id}/documents`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const count =
          (response?.data?.prescriptions ? 1 : 0) +
          (response?.data?.lab_results ? 1 : 0);
        if (!cancelled) setDocCount(count);
      } catch (error) {
        console.error("Error fetching document count:", error);
      }
    };
    fetchDocumentCount();
    return () => {
      cancelled = true;
    };
  }, [record.record_id, token]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";

  const getCreatorDetails = () => {
    if (isSelf) {
      return {
        role: "Patient (Self)",
        tone: "neutral",
        photo: record.patient?.photo,
        fallbackIcon: <User className="text-5xl text-subtle" aria-hidden="true" />,
        name: record.patient?.full_name || "You",
        details: [
          { icon: FiMail, label: "Email", value: record.patient?.email },
          { icon: FiPhone, label: "Phone", value: record.patient?.phone_no },
          { icon: FiUser, label: "Gender", value: record.patient?.gender },
          { icon: FiMapPin, label: "Address", value: record.patient?.address },
          { icon: FiCalendar, label: "Date Added", value: formatDate(record.created_at) },
        ],
      };
    }

    if (record.doctor) {
      const specs = record.doctor.specializations || record.doctor.specialization;
      const formattedSpecs = Array.isArray(specs) ? specs.join(", ") : specs;

      return {
        role: "Doctor",
        tone: "doctor",
        photo: record.doctor.photo,
        fallbackIcon: <Stethoscope className="text-5xl text-doctor" aria-hidden="true" />,
        name: record.doctor.full_name || record.doctor_name || "Unknown Doctor",
        details: [
          { icon: FiTag, label: "Specialization", value: formattedSpecs },
          { icon: FiMail, label: "Email", value: record.doctor.email },
          { icon: FiPhone, label: "Phone", value: record.doctor.phone_no },
        ],
      };
    }

    if (record.hospital) {
      return {
        role: "Hospital",
        tone: "hospital",
        photo: record.hospital.photo,
        fallbackIcon: <Building2 className="text-5xl text-hospital" aria-hidden="true" />,
        name: record.hospital.name || record.hospital_name || "Unknown Hospital",
        details: [
          { icon: FiMapPin, label: "Address", value: record.hospital.address },
          { icon: FiMail, label: "Email", value: record.hospital.email },
          { icon: FiPhone, label: "Phone", value: record.hospital.phone_no },
          { icon: FiGlobe, label: "Website", value: record.hospital.website },
        ],
      };
    }

    return {
      role: displayType,
      tone: isDoctor ? "doctor" : "hospital",
      photo: null,
      fallbackIcon:
        isDoctor ? (
          <Stethoscope className="text-5xl text-doctor" aria-hidden="true" />
        ) : (
          <Building2 className="text-5xl text-hospital" aria-hidden="true" />
        ),
      name: isDoctor
        ? record.doctor_name || "Unknown Doctor"
        : record.hospital_name || "Unknown Hospital",
      details: [
        { icon: FiInfo, label: "Note", value: "Contact details not linked in database." },
      ],
    };
  };

  const creator = getCreatorDetails();

  const tags = [];
  if (record.is_hospitalized) tags.push("Hospitalization");
  if (record.is_surgery) tags.push("Surgery");

  return (
    <>
      <Card className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-lg font-bold text-foreground">
              {record.diagnosis_name || "Diagnosis"}
            </h3>

            <Badge tone={isDoctor ? "doctor" : isSelf ? "neutral" : "hospital"}>
              {isDoctor ? (
                <Stethoscope size={11} aria-hidden="true" />
              ) : isSelf ? (
                <User size={11} aria-hidden="true" />
              ) : (
                <Building2 size={11} aria-hidden="true" />
              )}
              {displayType}
            </Badge>

            <button
              type="button"
              onClick={() => setShowCreatorInfo(true)}
              aria-label="View creator details"
              className="rounded-full border border-border bg-success-soft p-1.5 text-success transition-colors hover:bg-success-soft/70"
            >
              <FiEye size={14} aria-hidden="true" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              navigate(`/recordview/${record.record_id}?shc_code=${shc_code}&qr_code=${qr_code}`)
            }
          >
            View
            <FiArrowRight size={13} aria-hidden="true" />
          </Button>
        </div>

        {/* Date & time */}
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-1 border-b border-border pb-3 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="text-subtle" aria-hidden="true" />
            {formatDate(record.appointment_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="text-subtle" aria-hidden="true" />
            {formatTime(record.created_at)}
          </span>
        </div>

        {/* Doctor & hospital */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-subtle">Doctor</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {record.doctor_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-subtle">Hospital</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {record.hospital_name || "N/A"}
            </p>
          </div>
        </div>

        {/* Illness */}
        <div className="mb-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-subtle">
            History of present illness
          </p>
          <p className="line-clamp-2 text-sm text-muted">
            {record.history_of_present_illness || "—"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} tone={tag === "Hospitalization" ? "warning" : "info"}>
                {tag}
              </Badge>
            ))}
            <Badge tone="primary">{docCount || 0} Document(s)</Badge>
          </div>
          <p className="text-xs font-medium text-subtle">Reg: {record.reg_no || "N/A"}</p>
        </div>
      </Card>

      {/* Creator modal */}
      <Modal
        open={showCreatorInfo}
        onClose={() => setShowCreatorInfo(false)}
        title="Creator Details"
        description="Information about who created this record"
        size="sm"
        footer={
          <Button className="w-full" onClick={() => setShowCreatorInfo(false)}>
            Close Profile
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-3 pb-2">
          {creator.photo ? (
            <img
              src={creator.photo}
              alt={creator.name}
              className="h-24 w-24 rounded-full border-4 border-surface object-cover shadow-card"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-hover">
              {creator.fallbackIcon}
            </div>
          )}
          <h3 className="font-display text-xl font-bold text-foreground">{creator.name}</h3>
          <Badge tone={creator.tone}>{creator.role}</Badge>
        </div>

        <div className="space-y-3">
          {creator.details.map(
            (detail, index) =>
              detail.value && (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted">
                    <detail.icon size={15} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                      {detail.label}
                    </p>
                    <p className="break-words text-sm font-medium text-foreground">
                      {detail.value}
                    </p>
                  </div>
                </div>
              )
          )}
          {creator.details.every((d) => !d.value) && (
            <p className="py-4 text-center text-sm italic text-subtle">No contact details found.</p>
          )}
        </div>
      </Modal>
    </>
  );
}
