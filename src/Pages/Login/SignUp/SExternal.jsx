import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

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
const FormTextarea = ({ id, name, label, value, onChange, placeholder }) => (
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
        placeholder={placeholder}
        className="w-full bg-transparent outline-none resize-none"
        rows="2"
      ></textarea>
    </div>
  </div>
);



export default function SExternal() {
  const navigate = useNavigate();
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
    gender: "",
    date_of_birth: "",
    photo: "", 
    org_name: "",
    org_type: "",
    org_address: "",
    org_description: "",
    org_founded_on: "",
    org_website: "",
    org_license_no: "",
    org_license_valid_till: "",
    verification_documents: ""
  });

  // Handle Photo Upload
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, uploadData);
      setFormData((prev) => ({ ...prev, photo: res.data.url }));
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Photo upload failed.");
    }
  };

  // Handle Document Upload
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    const uploadData = new FormData();
    uploadData.append("doc", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/doc`, uploadData);
      setFormData((prev) => ({ ...prev, verification_documents: res.data.url }));
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const Signup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password ||
      !formData.org_name ||
      !formData.org_license_no ||
      !formData.verification_documents
    ) {
      toast.error("Please fill all required fields and upload documents");
      return;
    }

    const payload = {
      role: "extern",
      full_name: formData.full_name,
      email: formData.email,
      phone_no: formData.phone_no,
      password: formData.password,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
      photo: formData.photo,
      verification_documents: formData.verification_documents,
      
      organization_details: {
        org_name: formData.org_name,
        org_type: formData.org_type,
        org_address: formData.org_address,
        org_description: formData.org_description,
        org_founded_on: formData.org_founded_on ? new Date(formData.org_founded_on).toISOString() : null,
        org_website: formData.org_website,
        org_license_no: formData.org_license_no,
        org_license_valid_till: formData.org_license_valid_till ? new Date(formData.org_license_valid_till).toISOString() : null,
      }
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload);
      if (response.status === 201) {
        toast.success("Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("External Signup Error Details:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-8">
        <img src="Logo.png" alt="logo" className="w-40" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">
          Sign Up - External
        </h2>
      </header>

      <form
        onSubmit={Signup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-6xl"
      >
        {/* 🔥 Upload Photo */}
        <Profile
          onFileSelect={(file) => handlePhotoUpload(file)}
          photo={formData.photo}
        />
        <p className="text-center text-gray-500 text-sm mt-2">Representative Photo</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          
          {/* --- Col 1: Representative Details --- */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg text-blue-800 border-b pb-2">Representative Info</h4>
            
            <FormInput
              id="fullName"
              name="full_name"
              label="Full Name"
              onChange={changehandle}
              value={formData.full_name}
              placeholder="Your Name"
            />
            <FormInput
              id="email"
              name="email"
              label="Email Address"
              type="email"
              onChange={changehandle}
              value={formData.email}
            />
            <FormInput
              id="phone"
              name="phone_no"
              label="Phone Number"
              onChange={changehandle}
              value={formData.phone_no}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                id="dob"
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                onChange={changehandle}
                value={formData.date_of_birth}
              />
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Gender</label>
                <div className="w-full border border-gray-300 rounded-full px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={changehandle}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={changehandle}
              value={formData.password}
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              onChange={changehandle}
              value={formData.confirmPassword}
            />
          </div>

          {/* --- Col 2: Organization Details --- */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg text-blue-800 border-b pb-2">Organization Info</h4>
            
            <FormInput
              id="orgName"
              name="org_name"
              label="Organization Name"
              onChange={changehandle}
              value={formData.org_name}
              placeholder="e.g. Health Insure Co."
            />

            <div>
              <label className="block mb-1 font-medium text-gray-700">Org Type</label>
              <div className="w-full border border-gray-300 rounded-full px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <select
                  name="org_type"
                  value={formData.org_type}
                  onChange={changehandle}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Insurance">Insurance Provider</option>
                  <option value="Research">Research Institute</option>
                  <option value="Government">Government Body</option>
                  <option value="NGO">NGO / Non-Profit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <FormInput
              id="website"
              name="org_website"
              label="Website URL"
              onChange={changehandle}
              value={formData.org_website}
              placeholder="https://"
            />

            <FormInput
              id="founded"
              name="org_founded_on"
              label="Founded On"
              type="date"
              onChange={changehandle}
              value={formData.org_founded_on}
            />

            <FormTextarea
              id="address"
              name="org_address"
              label="Headquarters Address"
              onChange={changehandle}
              value={formData.org_address}
            />
          </div>

          {/* --- Col 3: Legal & Verification --- */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 p-4 rounded-lg border mb-4 h-full">
              <h4 className="font-semibold text-lg mb-4 text-blue-800">Legal & Verification</h4>
              
              <div className="flex flex-col gap-4">
                <FormInput
                    id="licenseNo"
                    name="org_license_no"
                    label="Org License / Reg No"
                    onChange={changehandle}
                    value={formData.org_license_no}
                    placeholder="Reg. Number"
                />

                <FormInput
                    id="licenseValid"
                    name="org_license_valid_till"
                    label="License Valid Until"
                    type="date"
                    onChange={changehandle}
                    value={formData.org_license_valid_till}
                />

                <FormTextarea
                  id="desc"
                  name="org_description"
                  label="Short Description"
                  onChange={changehandle}
                  value={formData.org_description}
                  placeholder="Describe your organization's purpose..."
                />

                {/* --- Document Upload Section --- */}
                <div className="mt-2">
                  <label className="block mb-2 font-medium text-gray-700">
                    Verification Document
                  </label>
                  
                  <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${formData.verification_documents ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                    
                    {formData.verification_documents ? (
                      <div className="flex flex-col items-center text-green-600">
                         <FaCheckCircle className="text-3xl mb-1" />
                         <span className="text-sm font-semibold">Document Uploaded</span>
                         <a href={formData.verification_documents} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline mt-1">View</a>
                      </div>
                    ) : (
                      <>
                        {uploadingDoc ? (
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        ) : (
                          <>
                            <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500 mb-2">Auth Letter / License (PDF/IMG)</p>
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
                * Upload official documentation proving your organization's legitimacy.
              </p>
            </div>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition mt-4"
              type="submit"
            >
              Register External
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}