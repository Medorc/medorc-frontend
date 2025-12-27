import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar';
import AddRecordForm from './AddRecordForm';
import AddRecordForm2 from './AddRecordForm2';
import { useAuth } from "../../Context/AuthContext";
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

// --- CLOUDINARY DETAILS ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dr8hcq37p/upload";
const CLOUDINARY_UPLOAD_PRESET = "Medorc"; 
// -------------------------

const url = "http://localhost:3000";

function CreateRecordPage() {
  const { token, role } = useAuth(); // RESTORED: Get role from auth
  const [searchParams] = useSearchParams();
  const qr_code = searchParams.get("qr_code"); // RESTORED: Get query params
  const shc_code = searchParams.get("shc_code");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicDetails: {
      entry_type: role || "Self", // RESTORED: Use dynamic role
      diagnosis_name: "",
      doctor_name: "",
      hospital_name: "",
      appointment_date: "",
      history_of_present_illness: "",
      treatment_undergone: "",
      reg_no: "" 
    },
    hospitalizationDetails: {
      reason: "",
      duration: "",
      room_no: "",
      treatment_undergone: ""
    },
    surgeryDetails: {
      type: "",
      duration: "",
      bed_no: "",
      medical_condition: "",
      outcome: ""
    },
    documents: {
      prescriptions: "",
      lab_results: ""
    },
    ui: {
      showHospitalization: true,
      showSurgery: true
    }
  });

  const [uploading, setUploading] = useState({
    prescriptions: false,
    lab_results: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    prescriptions: null,
    lab_results: null,
  });

  // Handle input changes
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Toggle sections visibility
  const handleToggle = (section) => {
    setFormData(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        [section]: !prev.ui[section]
      }
    }));
  };

  // File upload handler for Cloudinary
  const handleFileUpload = async (file, documentType) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [documentType]: true }));

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const fileUrl = response.data.secure_url;

      // Save URL to form data
      handleChange('documents', documentType, fileUrl);
      
      // Save file info for display
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: {
          name: file.name,
          url: fileUrl,
          type: file.type
        }
      }));

    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`File upload failed for ${documentType}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const handleNext = () => {
    if (!formData.basicDetails.diagnosis_name.trim()) {
      alert('Please enter diagnosis name');
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  // Final submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate documents (Optional check, can be removed if strictly optional)
    if (!formData.documents.prescriptions && !formData.documents.lab_results) {
       toast.info('Note: No documents uploaded.');
    }

    // Convert date to ISO format
    const dateOnly = formData.basicDetails.appointment_date;
    const isoDateString = dateOnly ? `${dateOnly}T00:00:00.000Z` : "";

    const dataToSend = {
      qr_code: qr_code, // RESTORED
      shc_code: shc_code, // RESTORED
      basicDetails: {
        ...formData.basicDetails,
        appointment_date: isoDateString
      },
      ...(formData.ui.showHospitalization && {
        hospitalizationDetails: formData.hospitalizationDetails
      }),
      ...(formData.ui.showSurgery && {
        surgeryDetails: formData.surgeryDetails
      }),
      // FIX: Map frontend 'prescriptions' (plural) to backend 'prescription' (singular)
      documents: {
        prescription: formData.documents.prescriptions, 
        lab_results: formData.documents.lab_results
      }
    };

    try {
      // Clean up fields not needed for backend logic
      delete dataToSend.basicDetails.alternative_medicine;
      // NOTE: We do NOT delete reg_no anymore, as it might be needed.

      console.log("Submitting Data:", dataToSend);

      const response = await axios.post(`${url}/api/v1/patient/createrecord`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if(response.status === 201)
        toast.success('Medical record created successfully!');
      else
        toast.error('Failed to create record. Please try again.');
      
      // Reset form
      setFormData({
        basicDetails: {
          entry_type: role || "Self", // Reset with correct role
          diagnosis_name: "",
          doctor_name: "",
          hospital_name: "",
          appointment_date: "",
          history_of_present_illness: "",
          treatment_undergone: "",
          reg_no: ""
        },
        hospitalizationDetails: {
          reason: "",
          duration: "",
          room_no: "",
          treatment_undergone: ""
        },
        surgeryDetails: {
          type: "",
          duration: "",
          bed_no: "",
          medical_condition: "",
          outcome: ""
        },
        documents: {
          prescriptions: "",
          lab_results: ""
        },
        ui: {
          showHospitalization: true,
          showSurgery: true
        }
      });
      setUploadedFiles({ prescriptions: null, lab_results: null });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create record: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
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