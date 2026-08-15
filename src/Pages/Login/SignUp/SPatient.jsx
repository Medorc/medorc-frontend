import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import SignUpShell from "../../../Components/SignUpShell";
import { FieldInput, FieldTextarea, FieldSelect, FieldCheckbox } from "../../../Components/SignUpField";
import { Button } from "../../../Components/ui/Button";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
    blood_group: "",
    address: "",
    allergy: "",
    photo: "",
    smoking: false,
    alcoholism: false,
    tobacco: false,
    pregnancy: false,
    exercise: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      setData((prev) => ({ ...prev, photo: res.data.url }));
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error("Cloudinary error response:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Photo upload failed.");
    }
  };

  const changehandle = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      !data.date_of_birth ||
      !data.gender ||
      !data.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const submissionData = { ...data };
    delete submissionData.confirmPassword;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, submissionData);
      if (response.status === 201) {
        toast.success("Signup Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Signup Error Details:", error);
      toast.error(
        error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignUpShell title="Patient Sign Up">
      <form
        onSubmit={Signup}
        className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10"
      >
        <div className="mb-8 flex justify-center">
          <Profile onFileSelect={(file) => handlePhotoUpload(file)} photo={data.photo} />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
          {/* Personal */}
          <div className="flex flex-col gap-4">
            <FieldInput id="fullName" name="full_name" label="Full Name" required value={data.full_name} onChange={changehandle} />
            <FieldInput id="phoneNumber" name="phone_no" label="Phone Number" required value={data.phone_no} onChange={changehandle} />
            <FieldInput id="email" name="email" label="Email Address" type="email" required value={data.email} onChange={changehandle} />
            <FieldInput id="password" name="password" label="Password" type="password" required value={data.password} onChange={changehandle} />
            <FieldInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" required value={data.confirmPassword} onChange={changehandle} />
          </div>

          {/* Demographics & address */}
          <div className="flex flex-col gap-4">
            <FieldInput id="dob" name="date_of_birth" label="Date of Birth" type="date" required value={data.date_of_birth} onChange={changehandle} />
            <div className="grid grid-cols-2 gap-3">
              <FieldSelect id="gender" name="gender" label="Gender" required value={data.gender} onChange={changehandle} options={GENDER_OPTIONS} placeholder="Select Gender" />
              <FieldSelect id="bloodGroup" name="blood_group" label="Blood Group" value={data.blood_group} onChange={changehandle} options={BLOOD_GROUP_OPTIONS} placeholder="Blood Group" />
            </div>
            <FieldTextarea id="address" name="address" label="Address" required value={data.address} onChange={changehandle} />
            <FieldTextarea id="allergy" name="allergy" label="Allergy Details (if any)" value={data.allergy} onChange={changehandle} />
          </div>

          {/* Lifestyle */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-5">
              <h4 className="font-display text-base font-bold text-foreground">Lifestyle Info</h4>
              <div className="flex flex-col gap-3">
                <FieldCheckbox name="smoking" checked={data.smoking} onChange={changehandle} label="Smoking" />
                <FieldCheckbox name="alcoholism" checked={data.alcoholism} onChange={changehandle} label="Alcoholism" />
                <FieldCheckbox name="tobacco" checked={data.tobacco} onChange={changehandle} label="Tobacco" />
                <FieldCheckbox name="pregnancy" checked={data.pregnancy} onChange={changehandle} label="Pregnancy" />
                <FieldCheckbox name="exercise" checked={data.exercise} onChange={changehandle} label="Exercise Habit" />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </SignUpShell>
  );
}
