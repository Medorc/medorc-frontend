import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

// Cloudinary Config (Same as Patient)
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Reusable Input Component (Matches Patient Design)
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

// Reusable Textarea Component (Matches Patient Design)
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



export default function SDoctor() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "doctor",
    full_name: "",
    phone_no: "",
    email: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    gender: "",
    address: "",
    photo: "",
    specializations: "",
    license_no: "",
    years_of_experience: "",
    hospital_affiliation: ""
  });

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      setData((prev) => ({
        ...prev,
        photo: res.data.url,
      }));
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error("Cloudinary error response:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Photo upload failed.");
    }
  };

  const changehandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Signup = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !data.full_name ||
      !data.phone_no ||
      !data.email ||
      !data.password ||
      !data.license_no ||
      !data.specializations
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const submissionData = { ...data };

    if (submissionData.years_of_experience) {
      submissionData.years_of_experience = parseInt(submissionData.years_of_experience, 10);
    } else {
      submissionData.years_of_experience = 0;
    }

    delete submissionData.confirmPassword;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, submissionData);
      if (response.status === 201) {
        toast.success("Doctor Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Doctor Signup Error Details:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-8">
        <img src="Logo.png" alt="logo" className="w-40" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">
          Sign Up - Doctor
        </h2>
      </header>

      <form
        onSubmit={Signup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-6xl"
      >
        {/* 🔥 Upload Photo */}
        <Profile
          onFileSelect={(file) => handlePhotoUpload(file)}
          photo={data.photo}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Left Column: Personal Info */}
          <div className="flex flex-col gap-4">
            <FormInput
              id="fullName"
              name="full_name"
              label="Full Name"
              onChange={changehandle}
              value={data.full_name}
              placeholder="Dr. John Doe"
            />
            <FormInput
              id="phoneNumber"
              name="phone_no"
              label="Phone Number"
              onChange={changehandle}
              value={data.phone_no}
            />
            <FormInput
              id="email"
              name="email"
              label="Email Address"
              type="email"
              onChange={changehandle}
              value={data.email}
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

          {/* Middle Column: Demographics & Address */}
          <div className="flex flex-col gap-4">
            <FormInput
              id="dob"
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              onChange={changehandle}
              value={data.date_of_birth}
            />

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Gender
              </label>
              <div className="w-full border border-gray-300 rounded-full px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <select
                  name="gender"
                  value={data.gender}
                  onChange={changehandle}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <FormTextarea
              id="address"
              name="address"
              label="Clinic/Residential Address"
              onChange={changehandle}
              value={data.address}
            />

            <FormInput
              id="licenseNo"
              name="license_no"
              label="Medical License Number"
              onChange={changehandle}
              value={data.license_no}
            />
          </div>

          {/* Right Column: Professional Details */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 p-4 rounded-lg border mb-4 h-full">
              <h4 className="font-semibold text-lg mb-4 text-blue-800">Professional Details</h4>

              <div className="flex flex-col gap-4">
                <FormInput
                  id="specializations"
                  name="specializations"
                  label="Specialization"
                  onChange={changehandle}
                  value={data.specializations}
                  placeholder="e.g. Cardiologist"
                />

                <FormInput
                  id="experience"
                  name="years_of_experience"
                  label="Years of Experience"
                  type="number"
                  onChange={changehandle}
                  value={data.years_of_experience}
                />

                <FormInput
                  id="hospital"
                  name="hospital_affiliation"
                  label="Hospital Affiliation"
                  onChange={changehandle}
                  value={data.hospital_affiliation}
                  placeholder="Current Hospital"
                />
              </div>
            </div>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition mt-4"
              type="submit"
            >
              Sign Up as Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}