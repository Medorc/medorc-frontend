import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import NavButton from "../../Components/NavButton";
import { toast } from "react-toastify";
import {
  FaHospital,
  FaCamera,
  FaCheckCircle,
  FaRegHospital,
  FaShieldAlt,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaPen,
  FaSave,
  FaTimes,
  FaPhone,
  FaBuilding,
  FaFileUpload,
  FaEye,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

const ProfileInput = ({
  label,
  value,
  onChange,
  name,
  disabled,
  type = "text",
  icon,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      {icon && <span className="text-blue-400">{icon}</span>} {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 font-medium ${
          disabled
            ? "bg-slate-50 border-transparent text-slate-600 cursor-default"
            : "bg-white border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm"
        }`}
        value={value || ""}
        onChange={(e) => onChange(e, name)}
        disabled={disabled}
        placeholder={`Enter ${label}`}
      />
    </div>
  </div>
);

export default function HospitalProfile() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const url = "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    license_no: "",
    address: "",
    phone_no: "",
    website: "",
    license_valid_till: "",
    type: "",
    founded_on: "",
    verification_documents: "",
    photo: "",
  });

  const [originalData, setOriginalData] = useState({});

  // New State for Document Viewing
  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState(""); // 'image' or 'pdf'

  const getProfile = async () => {
    try {
      const detailsRes = await axios.get(`${url}/api/v1/hospital/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const credentialsRes = await axios.get(
        `${url}/api/v1/hospital/profile/credentials`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const combinedData = {
        ...detailsRes.data.data,
        ...credentialsRes.data.data,
      };

      setProfileData(combinedData);
      setOriginalData(combinedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    if (!token || role !== "hospital") navigate("/");
    else getProfile();
  }, [token, role]);

  // --- PREVIEW LOGIC ---
  useEffect(() => {
    const currentDoc = profileData.verification_documents;
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
  }, [profileData.verification_documents]);

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileData(originalData);
      setDocPreview(null); // Reset preview logic will re-run via useEffect
    }
    setIsEditing(!isEditing);
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...profileData };

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

        // Call separate endpoint for document if needed (similar to Doctor profile)
        try {
          await axios.patch(
            `${url}/api/v1/hospital/profile/documents`, // Confirmed endpoint in hospital.routes.ts
            { newDocument: fileUrl },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } catch (docErr) {
          console.error("Doc update error", docErr);
        }
      }

      // 2. Cleanup payload before main update
      if (dataToSend.verification_documents instanceof File) {
        delete dataToSend.verification_documents;
      }

      // If backend handles document update separately, we might not want to send it here,
      // but let's send the text URL if it's there.
      // However, if it's a File object that we just uploaded, we replaced it with URL above.

      await axios.patch(
        `${url}/api/v1/hospital/profile/credentials`,
        { newCredentials: dataToSend },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOriginalData(profileData);
      setIsEditing(false);
      setLoading(false);
      toast.success("Profile updated successfully");
    } catch {
      setLoading(false);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        setProfileData({ ...profileData, verification_documents: file });
      }
    } else {
      setProfileData({ ...profileData, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setProfileData({ ...profileData, verification_documents: null });
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

      <div className="w-full max-w-6xl px-4 mt-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 border border-slate-100 relative overflow-hidden">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-white shadow-inner flex items-center justify-center border border-blue-50">
              {profileData.photo ? (
                <img
                  src={profileData.photo}
                  alt="profile"
                  className="w-full h-full rounded-2xl"
                />
              ) : (
                <FaHospital size={64} className="text-blue-500 opacity-80" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all">
              <FaCamera size={14} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1 text-center md:text-left z-10">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {profileData.name || "Hospital Name"}
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
              <FaBuilding size={14} />
              {profileData.type || "General Hospital"}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1.5 shadow-sm">
                <FaCheckCircle size={12} /> Verified
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5 shadow-sm">
                <FaShieldAlt size={12} /> Accredited
              </span>
            </div>
          </div>

          <div className="flex shrink-0 z-10">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleEditToggle}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
              >
                <FaPen size={12} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-1 bg-slate-200/50 p-1.5 rounded-xl w-fit self-center md:self-start">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Hospital Details
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "credentials"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            Professional Credentials
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="md:col-span-2">
                  <ProfileInput
                    label="Hospital Name"
                    value={profileData.name}
                    onChange={handleChange}
                    name="name"
                    disabled={!isEditing}
                    icon={<FaRegHospital />}
                  />
                </div>
                <div className="md:col-span-2">
                  <ProfileInput
                    label="Hospital Address"
                    value={profileData.address}
                    onChange={handleChange}
                    name="address"
                    disabled={!isEditing}
                    icon={<FaMapMarkerAlt />}
                  />
                </div>
                <ProfileInput
                  label="Phone Number"
                  value={profileData.phone_no}
                  onChange={handleChange}
                  name="phone_no"
                  disabled={!isEditing}
                  icon={<FaPhone />}
                />
                <ProfileInput
                  label="Website URL"
                  value={profileData.website}
                  onChange={handleChange}
                  name="website"
                  disabled={!isEditing}
                  icon={<FaGlobe />}
                />
              </div>
            )}

            {activeTab === "credentials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <ProfileInput
                  label="License Number"
                  value={profileData.license_no}
                  onChange={handleChange}
                  name="license_no"
                  disabled={!isEditing}
                  icon={<FaIdCard />}
                />
                <ProfileInput
                  label="Facility Type"
                  value={profileData.type}
                  onChange={handleChange}
                  name="type"
                  disabled={!isEditing}
                  icon={<FaHospital />}
                />
                <ProfileInput
                  label="Founded Date"
                  type="date"
                  value={formatDateForInput(profileData.founded_on)}
                  onChange={handleChange}
                  name="founded_on"
                  disabled={!isEditing}
                  icon={<FaCalendarAlt />}
                />
                <ProfileInput
                  label="License Expiry"
                  type="date"
                  value={formatDateForInput(profileData.license_valid_till)}
                  onChange={handleChange}
                  name="license_valid_till"
                  disabled={!isEditing}
                  icon={<FaCalendarAlt />}
                />

                {/* --- REDESIGNED DOCUMENT UPLOAD / PREVIEW --- */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FaFileUpload className="text-blue-400" /> Verification
                    Documents
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
                            <FaFilePdf
                              size={40}
                              className="text-red-500 mb-2"
                            />
                            <span className="text-xs font-medium">
                              PDF Document
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 backdrop-blur-[1px]">
                          <FaEye size={18} />
                          <span className="text-sm font-semibold">View</span>
                        </div>

                        {/* Remove Button (Only in edit mode) */}
                        {isEditing && (
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
                        <p className="text-sm font-semibold text-slate-700">
                          Document Uploaded
                        </p>
                        <p className="text-xs text-slate-500">
                          Click the thumbnail to view full details.
                        </p>
                        {isEditing && (
                          <p className="text-xs text-blue-500 mt-2">
                            To replace, remove this file first.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // UPLOAD BOX (Shown when no document)
                    <div
                      className={`relative w-full rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-8 text-center overflow-hidden ${
                        isEditing
                          ? "border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer group"
                          : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/*, application/pdf"
                            onChange={(e) =>
                              handleChange(e, "verification_documents")
                            }
                          />
                          <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-200">
                            <FaFileUpload size={24} />
                          </div>
                          <p className="text-slate-800 font-medium">
                            Click to upload credentials
                          </p>
                          <p className="text-slate-500 text-sm mt-1">
                            PDF, JPG or PNG (Max 5MB)
                          </p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-500">
                            <FaIdCard size={20} />
                          </div>
                          <p className="text-slate-500 font-medium">
                            No documents uploaded
                          </p>
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
