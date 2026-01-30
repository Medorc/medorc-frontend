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
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaFileContract,
  FaCalendarAlt,
  FaInfoCircle,
  FaFileUpload,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import PesonalDetails from "../../Components/PesonalDetails";
import NavButton from "../../Components/NavButton";

export default function ExternProfile() {
  const { token, role } = useAuth();
  const url = "http://localhost:3000";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({});

  const [Organization, setOrganization] = useState({});

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${url}/api/v1/extern/profile/personal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      response.data.data.address = response.data.data.org_address;
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrganization = async () => {
    try {
      const response = await axios.get(
        `${url}/api/v1/extern/profile/organization`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      response.data.data.address = response.data.data.org_address;
      setOrganization(response.data.data);

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
    setOriginalOrganization({ ...Organization });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setOrganization(originalOrganization);
    setIsEditingOrg(false);
  };

  const handleOrgSave = async () => {
    try {
      const response = await axios.patch(
        `${url}/api/v1/extern/profile/organization`,
        {
          newOrganizationCredentials: Organization,
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
    }
  };

  const handleOrgChange = (e, field) => {
    setOrganization({ ...Organization, [field]: e.target.value });
  };

  if (!token || role !== "extern") {
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
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <FaBuilding size={24} />
                  </div>
                  Organization Details
                </h2>
                <p className="text-slate-500 text-sm mt-1 ml-14">
                  Manage your organization's profile and credentials.
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                  >
                    <FaSave /> Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOrgEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-semibold transition-colors border border-emerald-200"
                >
                  <FaPen size={14} /> Edit Details
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaBuilding />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_name || ""}
                    onChange={(e) => handleOrgChange(e, "org_name")}
                    disabled={!isEditingOrg}
                    placeholder="Organization Name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaMapMarkerAlt />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_address || ""}
                    onChange={(e) => handleOrgChange(e, "org_address")}
                    disabled={!isEditingOrg}
                    placeholder="Full Address"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaInfoCircle />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_type || ""}
                    onChange={(e) => handleOrgChange(e, "org_type")}
                    disabled={!isEditingOrg}
                    placeholder="e.g. Private Limited"
                  />
                </div>
              </div>

              <div className="md:row-span-2 flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Description
                </label>
                <textarea
                  className={`w-full px-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 h-full resize-none ${
                    isEditingOrg
                      ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                      : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                  }`}
                  rows="3"
                  value={Organization.org_description || ""}
                  onChange={(e) => handleOrgChange(e, "org_description")}
                  disabled={!isEditingOrg}
                  placeholder="Brief description of the organization..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Founded On
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaCalendarAlt />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_founded_on || ""}
                    onChange={(e) => handleOrgChange(e, "org_founded_on")}
                    disabled={!isEditingOrg}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaGlobe />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_website || ""}
                    onChange={(e) => handleOrgChange(e, "org_website")}
                    disabled={!isEditingOrg}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  License Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaFileContract />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_license_number || ""}
                    onChange={(e) => handleOrgChange(e, "org_license_number")}
                    disabled={!isEditingOrg}
                    placeholder="License #"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold ml-1">
                  License Valid Till
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaCalendarAlt />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none outline-none transition-all duration-200 ${
                      isEditingOrg
                        ? "bg-white border-emerald-300 ring-4 ring-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "bg-slate-50 border-transparent text-slate-600 cursor-default"
                    }`}
                    value={Organization.org_license_valid_till || ""}
                    onChange={(e) =>
                      handleOrgChange(e, "org_license_valid_till")
                    }
                    disabled={!isEditingOrg}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              {/* Verification Documents Area */}
              <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                <label className="text-slate-700 text-sm font-bold mb-3 block flex items-center gap-2">
                  <FaFileUpload className="text-emerald-500" /> Verification
                  Documents
                </label>
                <div className="group bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
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
                    className="mt-4 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mx-auto max-w-xs"
                    disabled={!isEditingOrg}
                    accept="image/*"
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
