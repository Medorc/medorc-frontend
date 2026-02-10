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
  FaFileContract,
  FaCalendarAlt,
  FaIdCard,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

const ProfileInput = ({ label, value, onChange, name, disabled, type = "text", icon }) => (
  <div className="flex flex-col gap-2 w-full mb-5">
    <label className="text-gray-600 font-semibold text-sm">{label}</label>
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition ${
        disabled
          ? "bg-gray-100 border-gray-200"
          : "bg-white border-blue-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      }`}
    >
      {icon && <span className="text-gray-400 text-lg">{icon}</span>}
      <input
        type={type}
        className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-500"
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
    hospital_name: "",
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

  const getProfile = async () => {
    try {
      const detailsRes = await axios.get(`${url}/api/v1/hospital/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const credentialsRes = await axios.get(
        `${url}/api/v1/hospital/profile/credentials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const combinedData = { ...detailsRes.data.data, ...credentialsRes.data.data };
      setProfileData(combinedData);
      setOriginalData(combinedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    if (!token || role !== "hospital") navigate("/");
    else getProfile();
  }, [token, role]);

  const handleEditToggle = () => {
    if (isEditing) setProfileData(originalData);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.patch(`${url}/api/v1/hospital/profile/credentials`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] flex flex-col items-center">
      <NavBar />
      <div className="w-full max-w-6xl px-4">
        <BackButton />
        <NavButton />
      </div>

      {/* Tabs */}
      <div className="max-w-6xl w-full px-4 mt-6">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "profile"
                ? "bg-[#1a3b8d] text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Hospital Details
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "credentials"
                ? "bg-[#1a3b8d] text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Professional Credentials
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl w-full px-4 sm:px-6 pb-12 mt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row gap-10">

          {/* LEFT SIDE */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <>
                <ProfileInput label="Hospital Name" value={profileData.hospital_name} onChange={handleChange} name="hospital_name" disabled={!isEditing} icon={<FaRegHospital />} />
                <ProfileInput label="Full Address" value={profileData.address} onChange={handleChange} name="address" disabled={!isEditing} icon={<FaMapMarkerAlt />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ProfileInput label="Phone Number" value={profileData.phone_no} onChange={handleChange} name="phone_no" disabled={!isEditing} icon={<FaPhone />} />
                  <ProfileInput label="Website" value={profileData.website} onChange={handleChange} name="website" disabled={!isEditing} icon={<FaGlobe />} />
                </div>
              </>
            )}

            {activeTab === "credentials" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ProfileInput label="License Number" value={profileData.license_no} onChange={handleChange} name="license_no" disabled={!isEditing} icon={<FaIdCard />} />
                  <ProfileInput label="Hospital Type" value={profileData.type} onChange={handleChange} name="type" disabled={!isEditing} icon={<FaHospital />} />
                  <ProfileInput label="Founded On" type="date" value={formatDateForInput(profileData.founded_on)} onChange={handleChange} name="founded_on" disabled={!isEditing} icon={<FaCalendarAlt />} />
                  <ProfileInput label="License Valid Till" type="date" value={formatDateForInput(profileData.license_valid_till)} onChange={handleChange} name="license_valid_till" disabled={!isEditing} icon={<FaCalendarAlt />} />
                </div>
              </>
            )}
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="w-full lg:w-1/3 flex flex-col items-center border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-10">
            <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FaCamera size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold">{profileData.hospital_name}</h3>
            <p className="text-gray-500 text-sm">{profileData.type}</p>

            <div className="flex gap-2 mt-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaCheckCircle size={12} /> Verified
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaShieldAlt size={12} /> Accredited
              </span>
            </div>

            <div className="w-full mt-8">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="w-full bg-[#1a3b8d] text-white py-3 rounded-xl mb-3">Save Changes</button>
                  <button onClick={handleEditToggle} className="w-full border py-3 rounded-xl">Cancel</button>
                </>
              ) : (
                <button onClick={handleEditToggle} className="w-full bg-[#1a3b8d] text-white py-3 rounded-xl">Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
