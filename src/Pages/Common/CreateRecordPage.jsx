import { useState } from "react";

import axios from "axios";
import NavBar from "../../Components/NavBar";
import AddRecordForm from "./AddRecordForm";
import AddRecordForm2 from "./AddRecordForm2";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

import { API_BASE_URL } from "../../config/api";

const STEPS = [
  { label: "Record Details" },
  { label: "Details for Record" },
];

function StepIndicator({ currentStep }) {
  return (
    <ol className="mx-auto flex w-full max-w-md items-center justify-center gap-3 py-6">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === currentStep;
        const done = stepNumber < currentStep;
        return (
          <li key={step.label} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                active || done
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-surface-hover text-subtle"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? "✓" : stepNumber}
            </span>
            <span
              className={`hidden text-sm font-semibold sm:inline ${
                active ? "text-foreground" : "text-subtle"
              }`}
            >
              {step.label}
            </span>
            {stepNumber < STEPS.length && (
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CreateRecordPage() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const qr_code = searchParams.get("qr_code");
  const shc_code = searchParams.get("shc_code");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicDetails: {
      entry_type: "Self",
      diagnosis_name: "",
      symptoms: "",
      treatment_summary: "",
      prescribed_medications: "",
      follow_up_advice: "",
      dietary_restrictions: "",
      reg_no: "",
      doctor_notes: "",
      doctor_name: "",
      hospital_name: "",
      specialization: "",
      appointment_date: "",
      alternative_medicine: false,
    },
    hospitalizationDetails: {
      admission_date: "",
      discharge_date: "",
      room_type: "",
      icu_stay: false,
      discharge_summary: "",
    },
    surgeryDetails: {
      surgery_name: "",
      surgery_date: "",
      surgeon_name: "",
      anesthesia_type: "",
      implant_details: "",
      complications: "",
    },
    documents: {
      prescriptions: "",
      lab_results: "",
      discharge_summary_doc: "",
      other_records: "",
    },
    ui: {
      showHospitalization: false,
      showSurgery: false,
    },
  });

  const [uploading, setUploading] = useState({
    prescriptions: false,
    lab_results: false,
    discharge_summary_doc: false,
    other_records: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleToggle = (section) => {
    setFormData((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        [section]: !prev.ui[section],
      },
    }));
  };

  const handleFileUpload = async (file, documentType) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [documentType]: true }));

    const formDataUpload = new FormData();
    formDataUpload.append("doc", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/doc`, formDataUpload);
      const fileUrl = response.data.url;

      handleChange("documents", documentType, fileUrl);

      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: {
          name: file.name,
          url: fileUrl,
          type: file.type,
        },
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`File upload failed for ${documentType}. Please try again.`);
    } finally {
      setUploading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const handleNext = () => {
    if (!formData.basicDetails.diagnosis_name.trim()) {
      toast.warning("Please enter diagnosis name");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documents.prescriptions && !formData.documents.lab_results) {
      toast.info("Please upload Lab Result ");
      return;
    }

    const dateOnly = formData.basicDetails.appointment_date;
    const isoDateString = dateOnly ? `${dateOnly}T00:00:00.000Z` : "";

    const dataToSend = {
      shc_code: shc_code,
      qr_code: qr_code,

      basicDetails: {
        ...formData.basicDetails,
        appointment_date: isoDateString,
      },
      ...(formData.ui.showHospitalization && {
        hospitalizationDetails: formData.hospitalizationDetails,
      }),
      ...(formData.ui.showSurgery && {
        surgeryDetails: formData.surgeryDetails,
      }),
      documents: formData.documents,
    };

    try {
      delete dataToSend.basicDetails.reg_no;
      delete dataToSend.basicDetails.alternative_medicine;

      const response = await axios.post(
        `${API_BASE_URL}/patient/createrecord`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Medical record created successfully!");
        if (role == "hospital" || role == "doctor")
          navigate(`/${role}/records?qr_code=${qr_code}&shc_code=${shc_code}`);
        else navigate(`/${role}/records`);
      } else toast.error("Failed to create record. Please try again.");

      setFormData({
        basicDetails: {
          entry_type: "Self",
          diagnosis_name: "",
          doctor_name: "",
          hospital_name: "",
          appointment_date: "",
          history_of_present_illness: "",
          treatment_undergone: "",
        },
        hospitalizationDetails: {
          reason: "",
          duration: "",
          room_no: "",
          treatment_undergone: "",
        },
        surgeryDetails: {
          type: "",
          duration: "",
          bed_no: "",
          medical_condition: "",
          outcome: "",
        },
        documents: {
          prescriptions: "",
          lab_results: "",
        },
        ui: {
          showHospitalization: true,
          showSurgery: true,
        },
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Failed to create record: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <NavBar />

      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <AddRecordForm
          data={formData.basicDetails}
          handleChange={handleChange}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <AddRecordForm2
          data={formData}
          uploading={uploading}
          uploadedFiles={uploadedFiles}
          handleChange={handleChange}
          handleToggle={handleToggle}
          handleFileUpload={handleFileUpload}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default CreateRecordPage;
