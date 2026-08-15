import { useState } from "react";

import { useNavigate } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import SignUpShell from "../../../Components/SignUpShell";
import { FieldInput, FieldTextarea, FieldSelect, DocUpload } from "../../../Components/SignUpField";
import { Button } from "../../../Components/ui/Button";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const ORG_TYPES = [
  { value: "Insurance", label: "Insurance Provider" },
  { value: "Research", label: "Research Institute" },
  { value: "Government", label: "Government Body" },
  { value: "NGO", label: "NGO / Non-Profit" },
  { value: "Other", label: "Other" },
];

export default function SExternal() {
  const navigate = useNavigate();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    verification_documents: "",
  });

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
        org_license_valid_till: formData.org_license_valid_till
          ? new Date(formData.org_license_valid_till).toISOString()
          : null,
      },
    };

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload);
      if (response.status === 201) {
        toast.success("Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("External Signup Error Details:", error);
      toast.error(
        error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignUpShell title="External Sign Up">
      <form
        onSubmit={Signup}
        className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10"
      >
        <div className="mb-6">
          <div className="flex justify-center">
            <Profile onFileSelect={(file) => handlePhotoUpload(file)} photo={formData.photo} />
          </div>
          <p className="mt-3 text-center text-sm text-muted">Representative Photo</p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
          {/* Representative */}
          <div className="flex flex-col gap-4">
            <h4 className="border-b border-border pb-2 font-display text-base font-bold text-foreground">
              Representative Info
            </h4>
            <FieldInput id="fullName" name="full_name" label="Full Name" required value={formData.full_name} onChange={changehandle} placeholder="Your Name" />
            <FieldInput id="email" name="email" label="Email Address" type="email" required value={formData.email} onChange={changehandle} />
            <FieldInput id="phone" name="phone_no" label="Phone Number" value={formData.phone_no} onChange={changehandle} />
            <div className="grid grid-cols-2 gap-3">
              <FieldInput id="dob" name="date_of_birth" label="DOB" type="date" value={formData.date_of_birth} onChange={changehandle} />
              <FieldSelect id="gender" name="gender" label="Gender" value={formData.gender} onChange={changehandle} options={GENDER_OPTIONS} placeholder="Select" />
            </div>
            <FieldInput id="password" name="password" label="Password" type="password" required value={formData.password} onChange={changehandle} />
            <FieldInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" required value={formData.confirmPassword} onChange={changehandle} />
          </div>

          {/* Organization */}
          <div className="flex flex-col gap-4">
            <h4 className="border-b border-border pb-2 font-display text-base font-bold text-foreground">
              Organization Info
            </h4>
            <FieldInput id="orgName" name="org_name" label="Organization Name" required value={formData.org_name} onChange={changehandle} placeholder="e.g. Health Insure Co." />
            <FieldSelect id="orgType" name="org_type" label="Org Type" value={formData.org_type} onChange={changehandle} options={ORG_TYPES} placeholder="Select Type" />
            <FieldInput id="website" name="org_website" label="Website URL" value={formData.org_website} onChange={changehandle} placeholder="https://" />
            <FieldInput id="founded" name="org_founded_on" label="Founded On" type="date" value={formData.org_founded_on} onChange={changehandle} />
            <FieldTextarea id="address" name="org_address" label="Headquarters Address" value={formData.org_address} onChange={changehandle} />
          </div>

          {/* Legal & verification */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-5">
              <h4 className="font-display text-base font-bold text-foreground">Legal &amp; Verification</h4>
              <FieldInput id="licenseNo" name="org_license_no" label="Org License / Reg No" required value={formData.org_license_no} onChange={changehandle} placeholder="Reg. Number" />
              <FieldInput id="licenseValid" name="org_license_valid_till" label="License Valid Until" type="date" value={formData.org_license_valid_till} onChange={changehandle} />
              <FieldTextarea id="desc" name="org_description" label="Short Description" value={formData.org_description} onChange={changehandle} placeholder="Describe your organization's purpose..." />
              <DocUpload
                state={uploadingDoc ? "uploading" : "idle"}
                uploadedUrl={formData.verification_documents}
                onUpload={handleDocUpload}
                label="Verification Document"
                hint="Auth Letter / License (PDF/IMG)"
              />
              <p className="text-xs text-subtle">
                * Upload official documentation proving your organization's legitimacy.
              </p>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Register External
            </Button>
          </div>
        </div>
      </form>
    </SignUpShell>
  );
}
