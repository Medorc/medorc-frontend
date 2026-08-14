import React, { useState } from "react";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import AddRecordForm from "./AddRecordForm";
import AddRecordForm2 from "./AddRecordForm2";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";


// --- CLOUDINARY DETAILS ---
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// -------------------------

import { API_BASE_URL } from "../../config/api";

function CreateRecordPage() {
  const { token,role } = useAuth();
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

  // Handle input changes
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Toggle sections visibility
  const handleToggle = (section) => {
    setFormData((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        [section]: !prev.ui[section],
      },
    }));
  };

  // File upload handler for Cloudinary
  const handleFileUpload = async (file, documentType) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [documentType]: true }));

    const formDataUpload = new FormData();
    formDataUpload.append("doc", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/cloudinary/doc`, formDataUpload);
      const fileUrl = response.data.url;

      // Save URL to form data
      handleChange("documents", documentType, fileUrl);

      // Save file info for display
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
    // Validate basic details before proceeding
    if (!formData.basicDetails.diagnosis_name.trim()) {
      alert("Please enter diagnosis name");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  // Final submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required documents
    if (!formData.documents.prescriptions && !formData.documents.lab_results) {
      toast.info("Please upload Lab Result ");
      return;
    }

    // Convert date to ISO format
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
        },
      );

      if (response.status === 201) {
        toast.success("Medical record created successfully!");
        if(role=="hospital"||role=="doctor")
        navigate(`/${role}/records?qr_code=${qr_code}&shc_code=${shc_code}`);
        else navigate(`/${role}/records`);
      } else toast.error("Failed to create record. Please try again.");

      // Reset form or redirect
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
        "Failed to create record: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="flex flex-col  items-center min-h-screen bg-gray-100">
      <NavBar />

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
