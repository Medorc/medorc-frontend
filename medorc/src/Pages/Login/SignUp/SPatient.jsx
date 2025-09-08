import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../../../Components/Profile';
import { toast } from 'react-toastify';
import axios from 'axios';

// A reusable input component for consistent styling
const FormInput = ({ id, name, label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>
    <div className="w-full border border-gray-300 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
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

const FormTextarea = ({ id, name, label, value, onChange, placeholder }) => (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>
      <div className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
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


export default function SPatient() {
  const [data, setData] = useState({
    role: "patient",
    full_name: "",
    phone_no: "",
    email: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    gender: "",
    address: "",
    allergy: "",
    photo: "", // Will hold the photo URL
    smoking: false,
    alcoholism: false,
    tobacco: false,
    pregnancy: false,
    exercise: false,
  });

  const navigate = useNavigate();

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/cloudinary/photo", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setData((prev) => ({ ...prev, photo: response.data.url }));
      toast.success("Profile photo uploaded!");
    } catch (err) {
      console.log(err);
      toast.error("Photo upload failed. Please try again.")
    }
  };

  const changehandle = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const url = "http://localhost:3000/api/v1/auth/signup";

  const Signup = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!data.full_name || !data.phone_no || !data.email || !data.password || !data.date_of_birth || !data.gender || !data.address) {
      toast.error("Please fill all the required fields");
      return;
    }
    
    const submissionData = { ...data };
    delete submissionData.confirmPassword;

    try {
      const response = await axios.post(url, submissionData);
      if (response.status === 201) {
        toast.success("Signup successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-8">
        <img src="Logo.png" alt="logo" className="w-40" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">Sign Up - Patient</h2>
      </header>

      <form onSubmit={Signup} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-6xl">
        <Profile onFileSelect={handlePhotoUpload} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <FormInput id="fullName" name="full_name" label="Full Name" onChange={changehandle} value={data.full_name} />
            <FormInput id="phoneNumber" name="phone_no" label="Phone Number" onChange={changehandle} value={data.phone_no} />
            <FormInput id="email" name="email" label="Email Address" type="email" onChange={changehandle} value={data.email} />
            <FormInput id="password" name="password" label="Password" type="password" onChange={changehandle} value={data.password} />
            <FormInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" onChange={changehandle} value={data.confirmPassword} />
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-4">
            <FormInput id="dob" name="date_of_birth" label="Date of Birth" type="date" onChange={changehandle} value={data.date_of_birth} />
             <div>
                <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">Gender</label>
                <div className="w-full border border-gray-300 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                    <select id="gender" onChange={changehandle} name="gender" value={data.gender} className="w-full bg-transparent outline-none">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <FormTextarea id="address" name="address" label="Address" onChange={changehandle} value={data.address} />
            <FormTextarea id="allergy" name="allergy" label="Allergy Details (if any)" onChange={changehandle} value={data.allergy} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-lg mb-3">Lifestyle Info</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="checkbox" name="smoking" onChange={changehandle} checked={data.smoking} className="rounded" /> Smoking</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="alcoholism" onChange={changehandle} checked={data.alcoholism} className="rounded" /> Alcoholism</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="tobacco" onChange={changehandle} checked={data.tobacco} className="rounded" /> Tobacco</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="pregnancy" onChange={changehandle} checked={data.pregnancy} className="rounded" /> Pregnancy</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="exercise" onChange={changehandle} checked={data.exercise} className="rounded" /> Exercise Habit</label>
              </div>
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition duration-300 mt-4" type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
}
