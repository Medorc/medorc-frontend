import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import SignUpShell from "../../../Components/SignUpShell";
import { FieldInput, FieldTextarea, FieldSelect } from "../../../Components/SignUpField";
import { Button } from "../../../Components/ui/Button";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export default function SDoctor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    hospital_affiliation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const gEmail = searchParams.get("google_email") || sessionStorage.getItem("google_email");
    const gName = searchParams.get("google_name") || sessionStorage.getItem("google_name");
    const gPhoto = searchParams.get("google_photo") || sessionStorage.getItem("google_photo");
    if (gEmail || gName || gPhoto) {
      setData((prev) => ({
        ...prev,
        email: gEmail || prev.email,
        full_name: gName || prev.full_name,
        photo: gPhoto || prev.photo,
      }));
    }
  }, [searchParams]);

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
    submissionData.years_of_experience = data.years_of_experience
      ? parseInt(data.years_of_experience, 10)
      : 0;
    delete submissionData.confirmPassword;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, submissionData);
      if (response.status === 201) {
        toast.success("Doctor Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Doctor Signup Error Details:", error);
      toast.error(
        error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignUpShell title="Doctor Sign Up">
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
            <FieldInput id="fullName" name="full_name" label="Full Name" required value={data.full_name} onChange={changehandle} placeholder="Dr. John Doe" />
            <FieldInput id="phoneNumber" name="phone_no" label="Phone Number" required value={data.phone_no} onChange={changehandle} />
            <FieldInput id="email" name="email" label="Email Address" type="email" required value={data.email} onChange={changehandle} />
            <FieldInput id="password" name="password" label="Password" type="password" required value={data.password} onChange={changehandle} />
            <FieldInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" required value={data.confirmPassword} onChange={changehandle} />
          </div>

          {/* Demographics & license */}
          <div className="flex flex-col gap-4">
            <FieldInput id="dob" name="date_of_birth" label="Date of Birth" type="date" value={data.date_of_birth} onChange={changehandle} />
            <FieldSelect id="gender" name="gender" label="Gender" value={data.gender} onChange={changehandle} options={GENDER_OPTIONS} placeholder="Select Gender" />
            <FieldTextarea id="address" name="address" label="Clinic / Residential Address" value={data.address} onChange={changehandle} />
            <FieldInput id="licenseNo" name="license_no" label="Medical License Number" required value={data.license_no} onChange={changehandle} />
          </div>

          {/* Professional */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-5">
              <h4 className="font-display text-base font-bold text-foreground">Professional Details</h4>
              <FieldInput id="specializations" name="specializations" label="Specialization" required value={data.specializations} onChange={changehandle} placeholder="e.g. Cardiologist" />
              <FieldInput id="experience" name="years_of_experience" label="Years of Experience" type="number" value={data.years_of_experience} onChange={changehandle} />
              <FieldInput id="hospital" name="hospital_affiliation" label="Hospital Affiliation" value={data.hospital_affiliation} onChange={changehandle} placeholder="Current Hospital" />
            </div>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Sign Up as Doctor
            </Button>
          </div>
        </div>
      </form>
    </SignUpShell>
  );
}
