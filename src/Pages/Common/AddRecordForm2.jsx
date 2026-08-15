import { useRef } from "react";

import { FiUploadCloud, FiCheckCircle, FiPlus } from "react-icons/fi";
import { Building2, Scissors } from "lucide-react";
import { Input } from "../../Components/ui/Field";
import { Button } from "../../Components/ui/Button";
import { Card } from "../../Components/ui/Card";
import { Badge } from "../../Components/ui/Badge";

function SectionToggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 cursor-pointer rounded accent-primary"
      />
      {label}
    </label>
  );
}

function AddRecordForm2({
  data,
  uploading,
  handleChange,
  handleToggle,
  handleFileUpload,
  onBack,
  onSubmit,
}) {
  const prescriptionInputRef = useRef(null);
  const labResultInputRef = useRef(null);

  const handlePrescriptionClick = () => {
    prescriptionInputRef.current?.click();
  };

  const handleLabResultClick = () => {
    labResultInputRef.current?.click();
  };

  const onFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, documentType);
    }
    e.target.value = null;
  };

  const UploadButton = ({ onClick, busy, busyLabel, label, icon: Icon }) => (
    <Button type="button" variant={busy ? "outline" : "primarySoft"} onClick={onClick} disabled={busy} className="w-full">
      {busy ? (
        <>
          <span className="animate-spin">…</span>
          {busyLabel}
        </>
      ) : (
        <>
          <Icon size={16} aria-hidden="true" />
          {label}
        </>
      )}
    </Button>
  );

  const UploadedLink = ({ href, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-success underline"
    >
      <FiCheckCircle size={14} aria-hidden="true" />
      {label}
    </a>
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
      <h2 className="mb-6 pb-2 text-center font-display text-2xl font-semibold tracking-wide text-foreground">
        Details For Record
      </h2>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Hospitalization Details */}
          <Card className="flex-1 min-w-[280px] p-4">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Building2 size={18} className="text-warning" aria-hidden="true" />
                Hospitalization Details
              </div>
              <SectionToggle
                checked={data.ui.showHospitalization}
                onChange={() => handleToggle("showHospitalization")}
                label=""
              />
            </div>

            {data.ui.showHospitalization && (
              <div className="space-y-4">
                <Input
                  id="roomNo"
                  label="Room no."
                  type="text"
                  value={data.hospitalizationDetails.room_no}
                  onChange={(e) => handleChange("hospitalizationDetails", "room_no", e.target.value)}
                />
                <Input
                  id="reasonHospitalization"
                  label="Reason for hospitalization"
                  type="text"
                  value={data.hospitalizationDetails.reason}
                  onChange={(e) => handleChange("hospitalizationDetails", "reason", e.target.value)}
                />
                <Input
                  id="hospTreatment"
                  label="Treatment undergone"
                  type="text"
                  value={data.hospitalizationDetails.treatment_undergone}
                  onChange={(e) =>
                    handleChange("hospitalizationDetails", "treatment_undergone", e.target.value)
                  }
                />
                <Input
                  id="hospDuration"
                  label="Duration"
                  type="text"
                  value={data.hospitalizationDetails.duration}
                  onChange={(e) => handleChange("hospitalizationDetails", "duration", e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Surgery Details */}
          <Card className="flex-1 min-w-[280px] p-4">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Scissors size={18} className="text-info" aria-hidden="true" />
                Surgery Details
              </div>
              <SectionToggle
                checked={data.ui.showSurgery}
                onChange={() => handleToggle("showSurgery")}
                label=""
              />
            </div>

            {data.ui.showSurgery && (
              <div className="space-y-4">
                <Input
                  id="surgeryType"
                  label="Type"
                  type="text"
                  value={data.surgeryDetails.type}
                  onChange={(e) => handleChange("surgeryDetails", "type", e.target.value)}
                />
                <Input
                  id="surgeryDuration"
                  label="Duration"
                  type="text"
                  value={data.surgeryDetails.duration}
                  onChange={(e) => handleChange("surgeryDetails", "duration", e.target.value)}
                />
                <Input
                  id="bedNo"
                  label="Bed No."
                  type="text"
                  value={data.surgeryDetails.bed_no}
                  onChange={(e) => handleChange("surgeryDetails", "bed_no", e.target.value)}
                />
                <Input
                  id="medicalCondition"
                  label="Medical condition"
                  type="text"
                  value={data.surgeryDetails.medical_condition}
                  onChange={(e) =>
                    handleChange("surgeryDetails", "medical_condition", e.target.value)
                  }
                />
                <Input
                  id="outcome"
                  label="Outcome"
                  type="text"
                  value={data.surgeryDetails.outcome}
                  onChange={(e) => handleChange("surgeryDetails", "outcome", e.target.value)}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Documents */}
        <div className="mt-6">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Documents</h3>
            <div className="flex max-w-sm flex-col gap-4">
              <div className="space-y-2">
                <UploadButton
                  onClick={handlePrescriptionClick}
                  busy={uploading.prescriptions}
                  busyLabel="Uploading..."
                  label="Add prescriptions"
                  icon={FiPlus}
                />
                {data.documents.prescriptions && !uploading.prescriptions && (
                  <UploadedLink href={data.documents.prescriptions} label="Prescription uploaded!" />
                )}
                <input
                  type="file"
                  ref={prescriptionInputRef}
                  onChange={(e) => onFileChange(e, "prescriptions")}
                  className="hidden"
                  accept="application/pdf,image/png,image/jpeg"
                  disabled={uploading.prescriptions}
                />
              </div>

              <div className="space-y-2">
                <UploadButton
                  onClick={handleLabResultClick}
                  busy={uploading.lab_results}
                  busyLabel="Uploading..."
                  label="Add lab results"
                  icon={FiPlus}
                />
                {data.documents.lab_results && !uploading.lab_results && (
                  <UploadedLink href={data.documents.lab_results} label="Lab results uploaded!" />
                )}
                <input
                  type="file"
                  ref={labResultInputRef}
                  onChange={(e) => onFileChange(e, "lab_results")}
                  className="hidden"
                  accept="application/pdf,image/png,image/jpeg"
                  disabled={uploading.lab_results}
                />
              </div>

              <Badge tone="neutral" className="w-fit">
                <FiUploadCloud size={12} aria-hidden="true" />
                PDF, PNG, or JPEG
              </Badge>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:justify-end md:gap-8">
          <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">
            Back
          </Button>
          <Button type="submit" className="w-full md:w-auto">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddRecordForm2;
