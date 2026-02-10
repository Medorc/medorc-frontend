import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import {
  FaPen,
  FaSave,
  FaTimes,
  FaUserMd,
  FaIdCard,
  FaHospital,
  FaStethoscope,
  FaFileUpload,
  FaClock,
  FaEye,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PesonalDetails from "../../Components/PesonalDetails";
import NavButton from "../../Components/NavButton";

export default function DoctorProfile() {
  const { token, role } = useAuth();
  const url = "http://localhost:3000";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [Credentials, setCredentials] = useState({});
  
  // New State for Document Viewing
  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState(""); // 'image' or 'pdf'

  const getProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/v1/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrganization = async () => {
    try {
      const response = await axios.get(
        `${url}/api/v1/doctor/profile/credentials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCredentials(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getOrganization();
  }, []);

  // --- PREVIEW LOGIC ---
  useEffect(() => {
    // Determine the document source (Backend URL or New File Object)
    const currentDoc = Credentials.verification_documents || Credentials.org_verification_documents;

    if (!currentDoc) {
      setDocPreview(null);
      return;
    }

    if (typeof currentDoc === "string") {
      // It's a URL from the backend
      setDocPreview(currentDoc);
      setFileType(currentDoc.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    } else if (currentDoc instanceof File) {
      // It's a newly uploaded file
      const objectUrl = URL.createObjectURL(currentDoc);
      setDocPreview(objectUrl);
      setFileType(currentDoc.type === "application/pdf" ? "pdf" : "image");

      // Cleanup memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [Credentials]);

  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [originalOrganization, setOriginalOrganization] = useState({});

  const handleOrgEdit = () => {
    setOriginalOrganization({ ...Credentials });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setCredentials(originalOrganization);
    setIsEditingOrg(false);
    setDocPreview(null); // Reset preview logic will re-run via useEffect
  };

  const handleOrgSave = async () => {
    try {
      // Note: If you are uploading files, you likely need FormData instead of JSON.
      // Keeping original logic as requested, but be aware of backend requirements.
      const dataToSend = { ...Credentials };
      delete dataToSend.verification_documents; // Prevent sending file object in JSON if backend expects separate upload

      const response = await axios.patch(
        `${url}/api/v1/doctor/profile/credentials`,
        { newCredentials: dataToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      setIsEditingOrg(false);
      setCredentials(response.data.data);
      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization details");
    }
  };

  // Improved Change Handler to support Files
  const handleOrgChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        // Use a consistent key for the document
        setCredentials({ ...Credentials, verification_documents: file });
      }
    } else {
      setCredentials({ ...Credentials, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation(); // Prevent opening modal
    setCredentials({ ...Credentials, verification_documents: null });
  };

  if (!token || role !== "doctor") navigate("/");

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pb-12 font-sans">
      <NavBar />
      <BackButton />
      <NavButton />

      {/* --- FULL SCREEN DOCUMENT MODAL --- */}
      {isViewModalOpen && docPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-100 border-b">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <FaIdCard /> Document Preview
              </h3>
              <div className="flex gap-3">
                 <a 
                   href={docPreview} 
                   download="document"
                   target="_blank"
                   rel="noreferrer"
                   className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                 >
                   Download / Open New Tab
                 </a>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 bg-slate-200 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 bg-slate-50 relative overflow-auto flex items-center justify-center p-4">
              {fileType === "pdf" ? (
                <iframe
                  src={docPreview}
                  title="Document Viewer"
                  className="w-full h-full rounded-lg border border-slate-200"
                />
              ) : (
                <img
                  src={docPreview}
                  alt="Full Preview"
                  className="max-w-full max-h-full object-contain shadow-lg rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
          <PesonalDetails data={profile} />

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="px-6 py-6 md:px-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  <FaUserMd size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Professional Credentials
                  </h2>
                  <p className="text-slate-500 text-sm">
                    License, experience, and hospital affiliations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {isEditingOrg ? (
                  <>
                    <button
                      onClick={handleOrgCancel}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleOrgSave}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                      <FaSave /> Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleOrgEdit}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all flex items-center gap-2"
                  >
                    <FaPen size={12} /> Edit Credentials
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Inputs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FaIdCard className="text-blue-400" /> License Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingOrg}
                    value={Credentials.license_no || ""}
                    onChange={(e) => handleOrgChange(e, "license_no")}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 font-medium ${
                      isEditingOrg
                        ? "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FaClock className="text-blue-400" /> Experience (Years)
                  </label>
                  <input
                    type="number"
                    disabled={!isEditingOrg}
                    value={Credentials.years_of_experience || ""}
                    onChange={(e) => handleOrgChange(e, "years_of_experience")}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 font-medium ${
                      isEditingOrg
                        ? "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FaHospital className="text-blue-400" /> Current Affiliation
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingOrg}
                    value={Credentials.hospital_affiliation || ""}
                    onChange={(e) => handleOrgChange(e, "hospital_affiliation")}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 font-medium ${
                      isEditingOrg
                        ? "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FaStethoscope className="text-blue-400" /> Specialization
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingOrg}
                    value={Credentials.specialization || Credentials.specializations || ""}
                    onChange={(e) => handleOrgChange(e, "specialization")}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 font-medium ${
                      isEditingOrg
                        ? "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                  />
                </div>

                {/* --- REDESIGNED DOCUMENT UPLOAD / PREVIEW --- */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FaFileUpload className="text-blue-400" /> Verification Documents
                  </label>

                  {/* Logic: If doc exists, show Small Preview Box. Else, show Upload Box */}
                  {docPreview ? (
                    <div className="flex items-start gap-4">
                      {/* SMALL PREVIEW BOX */}
                      <div 
                        onClick={() => setIsViewModalOpen(true)}
                        className="group relative w-40 h-40 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all"
                      >
                        {/* Thumbnail Content */}
                        {fileType === "image" ? (
                          <img 
                            src={docPreview} 
                            alt="Doc thumbnail" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <FaFilePdf size={40} className="text-red-500 mb-2"/>
                            <span className="text-xs font-medium">PDF Document</span>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 backdrop-blur-[1px]">
                          <FaEye size={18} />
                          <span className="text-sm font-semibold">View</span>
                        </div>

                        {/* Remove Button (Only in edit mode) */}
                        {isEditingOrg && (
                          <button
                            onClick={removeFile}
                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 z-20"
                            title="Remove file"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1 pt-2">
                        <p className="text-sm font-semibold text-slate-700">Document Uploaded</p>
                        <p className="text-xs text-slate-500">Click the thumbnail to view full details.</p>
                        {isEditingOrg && (
                          <p className="text-xs text-blue-500 mt-2">
                            To replace, remove this file first.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // UPLOAD BOX (Shown when no document)
                    <div className={`relative w-full rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-8 text-center overflow-hidden ${
                      isEditingOrg
                        ? "border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer group"
                        : "border-slate-100 bg-slate-50 opacity-60"
                    }`}>
                      {isEditingOrg ? (
                        <>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/*, application/pdf"
                            onChange={(e) => handleOrgChange(e, "verification_documents")}
                          />
                          <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-200">
                            <FaFileUpload size={24} />
                          </div>
                          <p className="text-slate-800 font-medium">Click to upload credentials</p>
                          <p className="text-slate-500 text-sm mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                           <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-500">
                            <FaIdCard size={20} />
                          </div>
                          <p className="text-slate-500 font-medium">No documents uploaded</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}