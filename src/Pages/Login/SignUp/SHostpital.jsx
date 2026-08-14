import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { FaCloudUploadAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa"; // Added icons for upload UI

// Cloudinary Config
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Reusable Input Component
const FormInput = ({ id, name, label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label}
    </label>
    <div className="w-full border border-gray-300 rounded-full px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </div>
  </div>
);

// Reusable Textarea Component
const FormTextarea = ({ id, name, label, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label}
    </label>
    <div className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none resize-none"
        rows="2"
      ></textarea>
    </div>
  </div>
);



export default function SHospital() {
  const navigate = useNavigate();
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [data, setData] = useState({
    role: "hospital",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_no: "",
    address: "",
    photo: "",
    license_no: "",
    license_valid_till: "",
    website: "",
    type: "",
    founded_on: "",
    verification_documents: ""
  });

  // Handle Logo Upload
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      setData((prev) => ({ ...prev, photo: res.data.url }));
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Logo upload failed.");
    }
  };

  // Handle Document Upload (PDF/Image)
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("doc", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/doc`, formData);
      setData((prev) => ({ ...prev, verification_documents: res.data.url }));
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Document upload failed.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const changehandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const Signup = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.phone_no ||
      !data.license_no ||
      !data.address ||
      !data.verification_documents
    ) {
      toast.error("Please fill all fields and upload verification documents");
      return;
    }

    const submissionData = { ...data };
    delete submissionData.confirmPassword;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, submissionData);
      if (response.status === 201) {
        toast.success("Hospital Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Hospital Signup Error Details:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-8">
        <img src="Logo.png" alt="logo" className="w-40" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">
          Sign Up - Hospital
        </h2>
      </header>

      <form
        onSubmit={Signup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-6xl"
      >
        {/* 🔥 Upload Photo (Logo) */}
        <Profile
          onFileSelect={(file) => handlePhotoUpload(file)}
          photo={data.photo}
        />
        <p className="text-center text-gray-500 text-sm mt-2">Upload Hospital Logo</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Left Column: Account Info */}
          <div className="flex flex-col gap-4">
            <FormInput
              id="hospitalName"
              name="name"
              label="Hospital Name"
              onChange={changehandle}
              value={data.name}
              placeholder="e.g. City General Hospital"
            />
            <FormInput
              id="email"
              name="email"
              label="Official Email"
              type="email"
              onChange={changehandle}
              value={data.email}
            />
            <FormInput
              id="phone"
              name="phone_no"
              label="Contact Number"
              onChange={changehandle}
              value={data.phone_no}
            />
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={changehandle}
              value={data.password}
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              onChange={changehandle}
              value={data.confirmPassword}
            />
          </div>

          {/* Middle Column: Details & Address */}
          <div className="flex flex-col gap-4">
            <FormInput
              id="foundedOn"
              name="founded_on"
              label="Founded On"
              type="date"
              onChange={changehandle}
              value={data.founded_on}
            />
             
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Hospital Type
              </label>
              <div className="w-full border border-gray-300 rounded-full px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <select
                  name="type"
                  value={data.type}
                  onChange={changehandle}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="General">General Hospital</option>
                  <option value="Specialty">Specialty Center</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Teaching">Teaching Hospital</option>
                </select>
              </div>
            </div>

            <FormInput
              id="website"
              name="website"
              label="Website URL"
              onChange={changehandle}
              value={data.website}
              placeholder="https://..."
            />

            <FormTextarea
              id="address"
              name="address"
              label="Hospital Address"
              onChange={changehandle}
              value={data.address}
            />
          </div>

          {/* Right Column: Legal Details & Document Upload */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 p-4 rounded-lg border mb-4 h-full">
              <h4 className="font-semibold text-lg mb-4 text-blue-800">License & Verification</h4>
              
              <div className="flex flex-col gap-4">
                <FormInput
                    id="licenseNo"
                    name="license_no"
                    label="Hospital License Number"
                    onChange={changehandle}
                    value={data.license_no}
                    placeholder="Lic. No."
                />

                <FormInput
                    id="licenseValid"
                    name="license_valid_till"
                    label="License Valid Until"
                    type="date"
                    onChange={changehandle}
                    value={data.license_valid_till}
                />

                {/* --- Document Upload Section --- */}
                <div className="mt-2">
                  <label className="block mb-2 font-medium text-gray-700">
                    Upload Verification Document
                  </label>
                  
                  <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${data.verification_documents ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                    
                    {data.verification_documents ? (
                      <div className="flex flex-col items-center text-green-600">
                         <FaCheckCircle className="text-3xl mb-1" />
                         <span className="text-sm font-semibold">Document Uploaded</span>
                         <a href={data.verification_documents} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline mt-1">View</a>
                      </div>
                    ) : (
                      <>
                        {uploadingDoc ? (
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        ) : (
                          <>
                            <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500 mb-2">PDF, JPG or PNG</p>
                            <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition">
                              Choose File
                              <input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden" 
                                onChange={handleDocUpload}
                              />
                            </label>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Please upload a valid medical license or registration certificate.
              </p>
            </div>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition mt-4"
              type="submit"
            >
              Register Hospital
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}