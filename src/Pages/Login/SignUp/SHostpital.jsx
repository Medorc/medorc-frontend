import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Profile from "../../../Components/Profile";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import SignUpShell from "../../../Components/SignUpShell";
import { FieldInput, FieldTextarea, FieldSelect, DocUpload } from "../../../Components/SignUpField";
import { Button } from "../../../Components/ui/Button";

const HOSPITAL_TYPES = [
  { value: "General", label: "General Hospital" },
  { value: "Specialty", label: "Specialty Center" },
  { value: "Clinic", label: "Clinic" },
  { value: "Teaching", label: "Teaching Hospital" },
];

export default function SHospital() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    verification_documents: "",
  });

  useEffect(() => {
    const gEmail = searchParams.get("google_email") || sessionStorage.getItem("google_email");
    const gName = searchParams.get("google_name") || sessionStorage.getItem("google_name");
    const gPhoto = searchParams.get("google_photo") || sessionStorage.getItem("google_photo");
    if (gEmail || gName || gPhoto) {
      setData((prev) => ({
        ...prev,
        email: gEmail || prev.email,
        name: gName || prev.name,
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
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Logo upload failed.");
    }
  };

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

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, submissionData);
      if (response.status === 201) {
        toast.success("Hospital Registration Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Hospital Signup Error Details:", error);
      toast.error(
        error.response?.data?.error || error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignUpShell title="Hospital Sign Up">
      <form
        onSubmit={Signup}
        className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10"
      >
        <div className="mb-6">
          <div className="flex justify-center">
            <Profile onFileSelect={(file) => handlePhotoUpload(file)} photo={data.photo} />
          </div>
          <p className="mt-3 text-center text-sm text-muted">Upload Hospital Logo</p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
          {/* Account info */}
          <div className="flex flex-col gap-4">
            <FieldInput id="hospitalName" name="name" label="Hospital Name" required value={data.name} onChange={changehandle} placeholder="e.g. City General Hospital" />
            <FieldInput id="email" name="email" label="Official Email" type="email" required value={data.email} onChange={changehandle} />
            <FieldInput id="phone" name="phone_no" label="Contact Number" required value={data.phone_no} onChange={changehandle} />
            <FieldInput id="password" name="password" label="Password" type="password" required value={data.password} onChange={changehandle} />
            <FieldInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" required value={data.confirmPassword} onChange={changehandle} />
          </div>

          {/* Details & address */}
          <div className="flex flex-col gap-4">
            <FieldInput id="foundedOn" name="founded_on" label="Founded On" type="date" value={data.founded_on} onChange={changehandle} />
            <FieldSelect id="type" name="type" label="Hospital Type" value={data.type} onChange={changehandle} options={HOSPITAL_TYPES} placeholder="Select Type" />
            <FieldInput id="website" name="website" label="Website URL" value={data.website} onChange={changehandle} placeholder="https://..." />
            <FieldTextarea id="address" name="address" label="Hospital Address" required value={data.address} onChange={changehandle} />
          </div>

          {/* License & verification */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-5">
              <h4 className="font-display text-base font-bold text-foreground">License &amp; Verification</h4>
              <FieldInput id="licenseNo" name="license_no" label="Hospital License Number" required value={data.license_no} onChange={changehandle} placeholder="Lic. No." />
              <FieldInput id="licenseValid" name="license_valid_till" label="License Valid Until" type="date" value={data.license_valid_till} onChange={changehandle} />
              <DocUpload
                state={uploadingDoc ? "uploading" : "idle"}
                uploadedUrl={data.verification_documents}
                onUpload={handleDocUpload}
                label="Upload Verification Document"
                hint="PDF, JPG or PNG"
              />
              <p className="text-xs text-subtle">
                * Please upload a valid medical license or registration certificate.
              </p>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Register Hospital
            </Button>
          </div>
        </div>
      </form>
    </SignUpShell>
  );
}
