import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton"; 
import NavButton from "../../Components/NavButton";
import { toast } from "react-toastify";
import { FaHospital, FaCamera, FaCheckCircle, FaRegHospital, FaShieldAlt, FaGlobe, FaMapMarkerAlt, FaFileContract, FaCalendarAlt, FaIdCard, FaExternalLinkAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split('T')[0];
};

// Updated Component: Added mt-3 to label for top spacing and increased container margin
const ProfileInput = ({ label, value, onChange, name, disabled, type = "text", icon }) => (
  <div className="flex flex-col gap-3 w-full mb-6"> 
    <label className="text-gray-600 font-semibold text-sm mt-3">{label}</label>
    <div className={`flex items-center gap-4 rounded-lg px-4 py-3 border transition-colors ${disabled ? "bg-gray-100 border-gray-200" : "bg-white border-blue-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"}`}>
        {icon && <span className="text-gray-400 text-xl">{icon}</span>}
        <input
            type={type}
            className="bg-transparent w-full outline-none text-gray-800 font-medium disabled:text-gray-500 placeholder-gray-400"
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
  const url = "http://localhost:3000";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); 
  const [isEditing, setIsEditing] = useState(false);

  // State mapped to combine both API responses
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
    hospital_photo: "" 
  });

  const [originalData, setOriginalData] = useState({});

  const getProfile = async () => {
    try {
      // 1. Fetch Contact/General Details
      const detailsRes = await axios.get(
        `${url}/api/v1/hospital/details`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Fetch Professional Credentials
      const credentialsRes = await axios.get(
        `${url}/api/v1/hospital/profile/credentials`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const combinedData = {
        ...detailsRes.data.data,
        ...credentialsRes.data.data
      };

      setProfileData(combinedData);
      
      setLoading(false);
     

    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    if (!token || role !== "hospital") {
         navigate("/");
    } else {
        getProfile();
    }
  }, [token, role, navigate]);

  const handleEditToggle = () => {
    if (!isEditing) {
        // Start Editing: Save current state to "original" in case of cancel
        setOriginalData({ ...profileData });
        setIsEditing(true);
    } else {
        // Cancel Editing: Revert to original state
        setProfileData(originalData); 
        setIsEditing(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      await axios.patch(
        `${url}/api/v1/hospital/profile/credentials`, 
        profileData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the "original" data to match the new saved data
      const newcredentialsData = {
        ...profileData,
        ...credentialsRes.data.data
      };
      console.log("New Credentials Data:", newcredentialsData);
      setOriginalData(newcredentialsData); 
      setIsEditing(false);
      setLoading(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] flex flex-col items-center font-sans">
      <NavBar />
      
      {/* Header Section */}
      <div className="w-full  mx-auto  ">

        <div className="flex flex-col items-center justify-between mb-4">

             <BackButton/>

             <NavButton/>

        </div>

      </div>

      {/* Main Content Card */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-start">
            
            {/* LEFT COLUMN: Form Details */}
            <div className="flex-1 w-full space-y-8 flex flex-col gap-4">
                
                {/* Section 1: Contact Information */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-50 p-2.5 rounded-lg text-[#1a3b8d]">
                            <FaHospital size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Hospital Information</h2>
                    </div>

                    <div className="space-y-2">
                        <ProfileInput 
                            label="Hospital Name" 
                            value={profileData.name} 
                            onChange={handleChange} 
                            name="name" 
                            disabled={!isEditing}
                            icon={<FaRegHospital className="text-gray-400 text-lg"/>}
                        />
                        <ProfileInput 
                            label="Full Address" 
                            value={profileData.address} 
                            onChange={handleChange} 
                            name="address" 
                            disabled={!isEditing}
                            icon={<FaMapMarkerAlt className="text-gray-400 text-lg"/>}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <ProfileInput 
                                label="Phone Number" 
                                value={profileData.phone_no} 
                                onChange={handleChange} 
                                name="phone_no" 
                                disabled={!isEditing}
                                icon={<FaPhone className="text-gray-400 text-lg "/>}
                            />
                            <ProfileInput 
                                label="Website" 
                                value={profileData.website} 
                                onChange={handleChange} 
                                name="website" 
                                disabled={!isEditing}
                                icon={<FaGlobe className="text-gray-400 text-lg"/>}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                {/* Section 2: Professional Credentials */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-50 p-2.5 rounded-lg text-[#1a3b8d]">
                            <FaShieldAlt size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Professional Credentials</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ProfileInput 
                            label="License Number" 
                            value={profileData.license_no} 
                            onChange={handleChange} 
                            name="license_no" 
                            disabled={!isEditing}
                            icon={<FaIdCard className="text-gray-400 text-lg"/>}
                        />
                        <ProfileInput 
                            label="Hospital Type" 
                            value={profileData.type} 
                            onChange={handleChange} 
                            name="type" 
                            disabled={!isEditing}
                            icon={<FaHospital className="text-gray-400 text-lg"/>}
                        />
                        <ProfileInput 
                            label="Founded On" 
                            value={formatDateForInput(profileData.founded_on)} 
                            onChange={handleChange} 
                            name="founded_on" 
                            type="date"
                            disabled={!isEditing}
                            icon={<FaCalendarAlt className="text-gray-400 text-lg"/>}
                        />
                         <ProfileInput 
                            label="License Valid Till" 
                            value={formatDateForInput(profileData.license_valid_till)} 
                            onChange={handleChange} 
                            name="license_valid_till" 
                            type="date"
                            disabled={!isEditing}
                            icon={<FaCalendarAlt className="text-gray-400 text-lg"/>}
                        />
                    </div>
                </div>

                 {/* Document Link */}
                 <div className="mt-4">
                    <label className="text-gray-600 font-semibold text-sm mb-2 block">Verification Document</label>
                    <div className="flex items-center gap-4">
                        {profileData.verification_documents ? (
                            <a 
                                href={profileData.verification_documents} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-100"
                            >
                                <FaFileContract /> View Document <FaExternalLinkAlt size={12}/>
                            </a>
                        ) : (
                            <span className="text-gray-400 text-sm italic">No document uploaded</span>
                        )}
                        
                        {isEditing && (
                            <button className="text-gray-500 text-sm underline hover:text-gray-700">
                                Upload New
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Visual Summary */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 items-center pt-4 lg:pt-8 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-10">
                {/* Photo Placeholder */}
                <div className="relative mb-6 group cursor-pointer">
                    <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg p-1 relative overflow-hidden bg-gray-100 flex items-center justify-center">
                        {profileData.hospital_photo ? (
                            <img src={profileData.hospital_photo} alt="Hospital Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <FaCamera size={32} />
                                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Hospital Logo</span>
                            </div>
                        )}
                    </div>
                    {/* Status Dot */}
                    <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm" title="Active"></div>
                </div>

                {/* Display Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
                    {profileData.hospital_name || "PSG Hospitals"}
                </h3>
                <p className="text-gray-500 text-sm mb-6 text-center">{profileData.type || "Medical Institution"}</p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <FaCheckCircle size={12} /> Verified
                    </span>
                    <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        <FaShieldAlt size={12} /> Accredited
                    </span>
                </div>

                 {/* Action Buttons */}
                <div className="w-full mt-auto">
                    {isEditing ? (
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleSave} 
                                className="w-full bg-[#1a3b8d] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-900 transition-all active:scale-95"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={handleEditToggle} 
                                className="w-full bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleEditToggle} 
                            className="w-full bg-[#1a3b8d] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-900 hover:shadow-xl transition-all active:scale-95"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}