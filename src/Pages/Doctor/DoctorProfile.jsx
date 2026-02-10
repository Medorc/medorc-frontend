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

  const getProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/v1/doctor/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const [isEditingOrg, setIsEditingOrg] = useState(false);

  const [originalOrganization, setOriginalOrganization] = useState({});

  const handleOrgEdit = () => {
    setOriginalOrganization({ ...Credentials });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setCredentials(originalOrganization);
    setIsEditingOrg(false);
  };

  const handleOrgSave = async () => {
    try {
      delete Credentials.verification_documents;
      const response = await axios.patch(
        `${url}/api/v1/doctor/profile/credentials`,
        {
          newCredentials: Credentials,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      console.log(response.data);
      setLoading(false);
      setIsEditingOrg(false);
      setCredentials(response.data.data);
      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization details");
    }
  };

  const handleOrgChange = (e, field) => {
    setCredentials({ ...Credentials, [field]: e.target.value });
  };

  if (!token || role !== "doctor") {
    navigate("/");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center pb-12 font-sans">
      <NavBar />
      <BackButton />
      <NavButton />

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
          {/* Personal Details Card */}
          <PesonalDetails data={profile} />

          {/* Organization Details Card */}
          <div className="bg-white rounded-3xl flex flex-col gap-4 shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FaUserMd size={24} />
                  </div>
                  Professional Credentials
                </h2>
                <p className="text-slate-500 text-sm mt-1 ml-14">
                  Manage your professional information and affiliations.
                </p>
              </div>

              {isEditingOrg ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleOrgCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleOrgSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                  >
                    <FaSave /> Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOrgEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold transition-colors border border-blue-200"
                >
                  <FaPen size={14} /> Edit Details
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  License Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaIdCard />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Credentials.license_no || ""}
                    onChange={(e) => handleOrgChange(e, "license_no")}
                    disabled={!isEditingOrg}
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Years of Experience
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaClock />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Credentials.years_of_experience || ""}
                    onChange={(e) => handleOrgChange(e, "years_of_experience")}
                    disabled={!isEditingOrg}
                    placeholder="E.g. 10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Hospital Affiliation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaHospital />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Credentials.hospital_affiliation || ""}
                    onChange={(e) => handleOrgChange(e, "hospital_affiliation")}
                    disabled={!isEditingOrg}
                    placeholder="Hospital Name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Specialization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaStethoscope />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-blue-300 ring-4 ring-blue-500/10 focus:border-blue-500 focus:ring-blue-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Credentials.specializations|| ""}
                    onChange={(e) => handleOrgChange(e, "specialization")}
                    disabled={!isEditingOrg}
                    placeholder="e.g. Cardiology"
                  />
                </div>
              </div>

              {/* Verification Documents Area */}
              <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                <label className="text-slate-700 text-sm font-bold mb-3 block flex items-center gap-2">
                  <FaFileUpload className="text-blue-500" /> Verification
                  Documents
                </label>
                <div className="group bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FaFileUpload size={20} />
                  </div>
                  {isEditingOrg ? (
                    <>
                      <p className="text-slate-700 font-medium text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        SVG, PNG, JPG or PDF (max. 5MB)
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500 font-medium text-sm">
                      No documents uploaded
                    </p>
                  )}

                  <input
                    type="file"
                    className="hidden" // Hiding the default file input for custom styling if needed, but for now we keep it simple or overlay it.
                    // Actually, to make it clickable we need the input to cover the area or be linked via label.
                    // For simplicity in this text replacement, I'll keep the visible input but style it better.
                    id="file-upload"
                    disabled={!isEditingOrg}
                    accept="image/*"
                    onChange={(e) =>
                      handleOrgChange(e, "org_verification_documents")
                    }
                  />
                  {/* Re-adding visible input for functionality if the custom UI is just visual */}
                  <input
                    type="file"
                    className="mt-4 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mx-auto max-w-xs"
                    disabled={!isEditingOrg}
                    accept="image/* , application/pdf"
                    onChange={(e) =>
                      handleOrgChange(e, "org_verification_documents")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
