import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import { FaPen, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";

export default function ExternProfile() {
  const { token, role } = useAuth();
  const url = "http://localhost:3000";

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
        }
      );
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
        }
      );
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

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  const [originalOrganization, setOriginalOrganization] = useState({});

  const handlePersonalEdit = () => {
    setOriginalProfile({ ...profile });
    setIsEditingPersonal(true);
  };

  const handlePersonalCancel = () => {
    setProfile(originalProfile);
    setIsEditingPersonal(false);
  };

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
        }
      );
      setLoading(false);
      setIsEditingOrg(false);

      toast.success("Organization updated successfully");
      getOrganization();
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization details");
    }
  };

  const handleProfileChange = (e, field) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleOrgChange = (e, field) => {
    setOrganization({ ...Organization, [field]: e.target.value });
  };

  const [activeTab, setActiveTab] = useState("personal");

  if (!token) {
    navigate("/login");
  }

  if (role !== "extern") {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-10  ">
      <NavBar />
      <BackButton showTitle={false} />

      {loading ? (
        <Loading />
      ) : (
        <div className=" mx-auto px-4 py-6 flex flex-col gap-6 justify-center sm:px-8">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "personal"
                    ? "bg-[#4A90E2] text-white"
                    : "text-gray-600 hover:text-[#4A90E2]"
                }`}
              >
                Personal profile
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "security"
                    ? "bg-[#4A90E2] text-white"
                    : "text-black hover:text-[#4A90E2]"
                }`}
              >
                Account & Security
              </button>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-xl border border-gray-400 p-8 mb-12   relative">
            <h2 className="text-[#4A82B3] text-xl font-medium mb-6 text-center">
              Personal Details
            </h2>

            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">Full Name:</label>
                  <input
                    type="text"
                    className="border border-black rounded px-3 py-2 w-full"
                    value={profile.full_name || ""}
                    onChange={(e) => handleProfileChange(e, "full_name")}
                    disabled={!isEditingPersonal}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">Gender:</label>
                  <input
                    type="text"
                    className="border border-black rounded px-3 py-2 w-full"
                    value={profile.gender || ""}
                    onChange={(e) => handleProfileChange(e, "gender")}
                    disabled={!isEditingPersonal}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">
                    Date of birth:
                  </label>
                  <input
                    type="text"
                    className="border border-black rounded px-3 py-2 w-full"
                    value={profile.date_of_birth || ""}
                    onChange={(e) => handleProfileChange(e, "date_of_birth")}
                    disabled={!isEditingPersonal}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-[#5EEAD4]"></div>
              </div>
            </div>
          </div>

          {/* Organization Details Card */}
          <div className="bg-white rounded-xl border border-gray-400 p-8 relative">
            <h2 className="text-[#4A82B3] text-xl font-medium mb-6 text-center">
              Organization details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Name:</label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_name || ""}
                  onChange={(e) => handleOrgChange(e, "org_name")}
                  disabled={!isEditingOrg}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Address:</label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_address || ""}
                  onChange={(e) => handleOrgChange(e, "org_address")}
                  disabled={!isEditingOrg}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Type:</label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_type || ""}
                  onChange={(e) => handleOrgChange(e, "org_type")}
                  disabled={!isEditingOrg}
                />
              </div>
              {/* Spacer for alignment if needed, or Description spans rows */}
              <div className="row-span-2 flex flex-col gap-2">
                <label className="text-black font-medium">Description:</label>
                <textarea
                  className="border border-black rounded px-3 py-2 w-full h-full resize-none"
                  rows="3"
                  value={Organization.org_description || ""}
                  onChange={(e) => handleOrgChange(e, "org_description")}
                  disabled={!isEditingOrg}
                ></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Founded on:</label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_founded_on || ""}
                  onChange={(e) => handleOrgChange(e, "org_founded_on")}
                  disabled={!isEditingOrg}
                />
              </div>
              {/* Empty div to maintain grid structure if needed, or adjust grid */}
              {/* Moving Website to left column */}
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Website:</label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_website || ""}
                  onChange={(e) => handleOrgChange(e, "org_website")}
                  disabled={!isEditingOrg}
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <label className="text-black font-medium">
                  Verification documents:
                </label>
                <div className="bg-gray-300 h-10 w-full md:w-48 rounded flex items-center justify-center overflow-hidden">
                  {/* REMOVED VALUE PROP FROM FILE INPUT */}
                  <input
                    type="file"
                    className="w-full text-center text-sm"
                    disabled={!isEditingOrg}
                    // Note: File uploads usually require different handling (FormData)
                    // and cannot be controlled via 'value' prop.
                    onChange={(e) =>
                      handleOrgChange(e, "org_verification_documents")
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">
                  License number:
                </label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_license_number || ""}
                  onChange={(e) => handleOrgChange(e, "org_license_number")}
                  disabled={!isEditingOrg}
                />
              </div>
              <div></div> {/* Spacer */}
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">
                  License valid till:
                </label>
                <input
                  type="text"
                  className="border border-black rounded px-3 py-2 w-full"
                  value={Organization.org_license_valid_till || ""}
                  onChange={(e) => handleOrgChange(e, "org_license_valid_till")}
                  disabled={!isEditingOrg}
                />
              </div>
            </div>
            {isEditingOrg ? (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={handleOrgSave} className="text-green-600">
                  <FaSave size={20} />
                </button>
                <button onClick={handleOrgCancel} className="text-red-600">
                  <FaTimes size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOrgEdit}
                className="absolute bottom-4 right-4 text-black"
              >
                <FaPen />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
