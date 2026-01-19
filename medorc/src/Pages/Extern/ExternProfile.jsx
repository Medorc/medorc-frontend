import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import { FaPen, FaSave, FaTimes } from "react-icons/fa";
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
        `${url}/api/v1/extern/profile`,
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
        }
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
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center ">
      <NavBar />
      <BackButton />
      <NavButton />

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full mx-auto px-4 py-6 flex flex-col gap-6  items-center sm:px-8">
          {/* Tabs */}

          {/* Personal Details Card */}
          <PesonalDetails data={profile}/>

          {/* Organization Details Card */}
          <div className="bg-white rounded-xl w-full max-w-7xl border border-gray-400 p-8 relative">
            <h2 className="text-[#0751A7] text-xl  font-semibold mb-6 text-start">
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
                    accept="image/*"
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
