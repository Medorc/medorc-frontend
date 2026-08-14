import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import NavButton from "../../Components/NavButton";
import {
  FaPen,
  FaSave,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaFileContract,
  FaCalendarAlt,
  FaInfoCircle,
  FaFileUpload,
  FaEye,
  FaFilePdf,
  FaTrash,
  FaIdCard,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PesonalDetails from "../../Components/PesonalDetails";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

// Helper Component for Inputs
const ProfileInput = ({
  label,
  value,
  onChange,
  name,
  disabled,
  type = "text",
  icon,
  placeholder,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      {icon && <span className="text-emerald-400">{icon}</span>} {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 font-medium ${
          disabled
            ? "bg-slate-50 border-transparent text-slate-600 cursor-default"
            : "bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 shadow-sm"
        }`}
        value={value || ""}
        onChange={(e) => onChange(e, name)}
        disabled={disabled}
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
  </div>
);

import { API_BASE_URL } from "../../config/api";

export default function ExternProfile() {
  const { token, role } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'credentials'

  const [profile, setProfile] = useState({});
  const [Organization, setOrganization] = useState({});
  const [originalOrganization, setOriginalOrganization] = useState({});

  const [isEditingOrg, setIsEditingOrg] = useState(false);

  // Document Preview State
  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState(""); // 'image' or 'pdf'

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/extern/profile/personal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      response.data.data.address = response.data.data.org_address;
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrganization = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/extern/profile/organization`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      response.data.data.address = response.data.data.org_address;
      setOrganization(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || role !== "extern") navigate("/");
    else {
      getProfile();
      getOrganization();
    }
  }, [token, role]);

  // --- PREVIEW LOGIC ---
  useEffect(() => {
    const currentDoc = Organization.verification_documents;

    if (!currentDoc) {
      setDocPreview(null);
      return;
    }

    if (typeof currentDoc === "string") {
      setDocPreview(currentDoc);
      setFileType(currentDoc.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    } else if (currentDoc instanceof File) {
      const objectUrl = URL.createObjectURL(currentDoc);
      setDocPreview(objectUrl);
      setFileType(currentDoc.type === "application/pdf" ? "pdf" : "image");

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [Organization.verification_documents]);

  const handleOrgEdit = () => {
    setOriginalOrganization({ ...Organization });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setOrganization(originalOrganization);
    setIsEditingOrg(false);
    setDocPreview(null); // Reset preview logic will re-run via useEffect
  };

  /* --- CLOUDINARY UPLOAD HELPER --- */
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        data,
      );
      return res.data.url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("File upload failed");
      return null;
    }
  };

  const handleOrgSave = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...Organization };

      // 1. Check if there's a new file to upload
      if (dataToSend.verification_documents instanceof File) {
        const fileUrl = await uploadImageToCloudinary(
          dataToSend.verification_documents,
        );

        if (!fileUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }

        // Replace file object with the returned URL
        dataToSend.verification_documents = fileUrl;
      }
      
      const uploadedDoc = await axios.patch(
        `${API_BASE_URL}/extern/profile/documents`,
        {newDocument: dataToSend.verification_documents},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      delete dataToSend.address;
      delete dataToSend.verification_documents

      const response = await axios.patch(
        `${API_BASE_URL}/extern/profile/organization`,
        {
          newOrganizationCredentials: dataToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);
      setIsEditingOrg(false);
      setOrganization(response.data.data);
      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization details");
      setLoading(false);
    }
  };

  const handleOrgChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        setOrganization({ ...Organization, verification_documents: file });
      }
    } else {
      setOrganization({ ...Organization, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setOrganization({ ...Organization, verification_documents: null });
  };

  if (loading) return <Loading />;

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
                <FaFileContract /> Document Preview
              </h3>
              <div className="flex gap-3">
                <a
                  href={docPreview}
                  download="document"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors font-semibold"
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Personal Details Card */}
        <PesonalDetails data={profile} />

        {/* --- Organization Header Card --- */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 border border-slate-100 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/60">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* Org Icon/Photo Placeholder */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-100 to-white shadow-inner flex items-center justify-center border border-emerald-50">
              <FaBuilding size={64} className="text-emerald-500 opacity-80" />
            </div>
          </div>

          {/* Org Info */}
          <div className="flex-1 flex flex-col gap-1 text-center md:text-left z-10 w-full">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {Organization.org_name || "Organization Name"}
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2 capitalize">
              <FaInfoCircle size={14} className="text-emerald-400" />
              {Organization.org_type || "Organization Type"}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                <FaCheckCircle size={12} /> Verified
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5 shadow-sm">
                <FaShieldAlt size={12} /> Partner
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex shrink-0 z-10 w-full md:w-auto justify-center">
            {isEditingOrg ? (
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={handleOrgCancel}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleOrgSave}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={handleOrgEdit}
                className="w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
              >
                <FaPen size={12} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* --- Content Tabs --- */}
        <div className="flex gap-1 bg-slate-200/50 p-1.5 rounded-xl w-fit self-center md:self-start">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "details"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Organization Details
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "credentials"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Credentials & Docs
          </button>
        </div>

        {/* --- Main Content Card --- */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="md:col-span-2">
                  <ProfileInput
                    label="Organization Name"
                    value={Organization.org_name}
                    onChange={handleOrgChange}
                    name="org_name"
                    disabled={!isEditingOrg}
                    icon={<FaBuilding />}
                  />
                </div>

                <div className="md:col-span-2">
                  <ProfileInput
                    label="Registered Address"
                    value={Organization.org_address}
                    onChange={handleOrgChange}
                    name="org_address"
                    disabled={!isEditingOrg}
                    icon={<FaMapMarkerAlt />}
                  />
                </div>

                <ProfileInput
                  label="Type"
                  value={Organization.org_type}
                  onChange={handleOrgChange}
                  name="org_type"
                  disabled={!isEditingOrg}
                  icon={<FaInfoCircle />}
                />

                <ProfileInput
                  label="Website URL"
                  value={Organization.org_website}
                  onChange={handleOrgChange}
                  name="org_website"
                  disabled={!isEditingOrg}
                  icon={<FaGlobe />}
                />

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-emerald-400">
                      <FaFileContract />
                    </span>
                    Description
                  </label>
                  <div className="relative group">
                    <textarea
                      className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 font-medium h-32 resize-none ${
                        !isEditingOrg
                          ? "bg-slate-50 border-transparent text-slate-600 cursor-default"
                          : "bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 shadow-sm"
                      }`}
                      value={Organization.org_description || ""}
                      onChange={(e) => handleOrgChange(e, "org_description")}
                      disabled={!isEditingOrg}
                      placeholder="Brief description of the organization..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CREDENTIALS TAB */}
            {activeTab === "credentials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <ProfileInput
                  label="License Number"
                  value={Organization.org_license_no}
                  onChange={handleOrgChange}
                  name="org_license_no"
                  disabled={!isEditingOrg}
                  icon={<FaIdCard />}
                />

                <ProfileInput
                  label="License Valid Till"
                  type="date"
                  value={formatDateForInput(
                    Organization.org_license_valid_till,
                  )}
                  onChange={handleOrgChange}
                  name="org_license_valid_till"
                  disabled={!isEditingOrg}
                  icon={<FaCalendarAlt />}
                />

                <ProfileInput
                  label="Founded On"
                  type="date"
                  value={formatDateForInput(Organization.org_founded_on)}
                  onChange={handleOrgChange}
                  name="org_founded_on"
                  disabled={!isEditingOrg}
                  icon={<FaCalendarAlt />}
                />

                {/* Empty spacer for alignment if needed, or remove */}
                <div className="hidden md:block"></div>

                {/* Document Upload Section */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FaFileUpload className="text-emerald-400" /> Verification
                    Documents
                  </label>

                  {docPreview ? (
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-slate-100/80">
                      <div
                        onClick={() => setIsViewModalOpen(true)}
                        className="group relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0"
                      >
                        {fileType === "image" ? (
                          <img
                            src={docPreview}
                            alt="Doc thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                            <FaFilePdf
                              size={32}
                              className="text-red-500 mb-2"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              PDF
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]">
                          <FaEye size={20} />
                        </div>

                        {/* Remove Button */}
                        {isEditingOrg && (
                          <button
                            onClick={removeFile}
                            className="absolute top-1 right-1 p-1 bg-white text-red-500 rounded shadow-sm hover:bg-red-50 z-20 transition-colors"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col justify-center h-24 md:h-32">
                        <p className="text-sm font-bold text-slate-700">
                          Document Uploaded
                        </p>
                        <p className="text-xs text-slate-500 mb-3 max-w-xs">
                          Your verification document is secure. You can view or
                          replace it here.
                        </p>
                        <button
                          onClick={() => setIsViewModalOpen(true)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 w-fit px-3 py-1.5 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                        >
                          <FaEye /> View Full Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`relative w-full rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-8 text-center overflow-hidden ${
                        isEditingOrg
                          ? "border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer group"
                          : "border-slate-100 bg-slate-50 opacity-70"
                      }`}
                    >
                      {isEditingOrg ? (
                        <>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/*, application/pdf"
                            onChange={(e) =>
                              handleOrgChange(e, "verification_documents")
                            }
                          />
                          <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-3 text-emerald-500 group-hover:scale-110 group-hover:text-emerald-600 transition-all duration-200 border border-emerald-100">
                            <FaFileUpload size={20} />
                          </div>
                          <p className="text-slate-800 font-semibold text-sm">
                            Click to upload document
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            Supported: PDF, JPG, PNG (Max 5MB)
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-400 py-4">
                          <div className="p-3 bg-slate-100 rounded-full">
                            <FaFileContract size={20} />
                          </div>
                          <span className="font-medium text-sm">
                            No documents uploaded yet.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
