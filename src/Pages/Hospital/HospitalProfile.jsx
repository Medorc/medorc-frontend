import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import NavButton from "../../Components/NavButton";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { Loading } from "../../Components/Loading";
import ProfileField from "../../Components/ProfileField";
import DocumentUpload from "../../Components/DocumentUpload";
import DocumentPreviewModal from "../../Components/DocumentPreviewModal";
import { Card, CardBody } from "../../Components/ui/Card";
import { Button } from "../../Components/ui/Button";
import { Badge } from "../../Components/ui/Badge";
import {
  Building2,
  Save,
  Pencil,
  X,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { API_BASE_URL } from "../../config/api";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

export default function HospitalProfile() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
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

  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const detailsRes = await axios.get(`${API_BASE_URL}/hospital/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const credentialsRes = await axios.get(
        `${API_BASE_URL}/hospital/profile/credentials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const combinedData = {
        ...detailsRes.data.data,
        ...credentialsRes.data.data,
      };

      setProfileData(combinedData);
      setOriginalData(combinedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to load profile data");
    }
  }, [token]);

  useEffect(() => {
    if (!token || role !== "hospital") navigate("/");
    else getProfile();
  }, [token, role, navigate, getProfile]);

  useEffect(() => {
    const currentDoc = profileData.verification_documents;
    if (!currentDoc) {
      setDocPreview(null);
      return;
    }

    if (typeof currentDoc === "string") {
      setDocPreview(currentDoc);
      setFileType(currentDoc.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    } else if (currentDoc instanceof File) {
      const objectUrl = URL.createObjectURL(currentDoc);
      setDocPreview(objectUrl);
      setFileType(currentDoc.type === "application/pdf" ? "pdf" : "image");

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileData.verification_documents]);

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileData(originalData);
      setDocPreview(null);
    }
    setIsEditing(!isEditing);
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, data);
      return res.data.url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("File upload failed");
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...profileData };

      if (dataToSend.verification_documents instanceof File) {
        const fileUrl = await uploadImageToCloudinary(dataToSend.verification_documents);

        if (!fileUrl) {
          setLoading(false);
          return;
        }

        dataToSend.verification_documents = fileUrl;

        try {
          await axios.patch(
            `${API_BASE_URL}/hospital/profile/documents`,
            { newDocument: fileUrl },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (docErr) {
          console.error("Doc update error", docErr);
        }
      }

      if (dataToSend.verification_documents instanceof File) {
        delete dataToSend.verification_documents;
      }

      await axios.patch(
        `${API_BASE_URL}/hospital/profile/credentials`,
        { newCredentials: dataToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        setProfileData({ ...profileData, verification_documents: file });
      }
    } else {
      setProfileData({ ...profileData, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setProfileData({ ...profileData, verification_documents: null });
  };

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background pb-12">
      <NavBar />
      <div className="mb-6 flex w-full flex-col items-center">
        <BackButton />
        <NavButton />
      </div>

      <DocumentPreviewModal
        open={isViewModalOpen}
        docPreview={docPreview}
        fileType={fileType}
        onClose={() => setIsViewModalOpen(false)}
        tone="hospital"
      />

      <main className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col gap-6">
          {/* Header card */}
          <Card as="section" aria-label="Hospital overview" className="relative overflow-hidden p-6 md:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-hospital/10 blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
              <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-hover shadow-card">
                  {profileData.photo ? (
                    <img src={profileData.photo} alt="Hospital" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 size={56} className="text-hospital" aria-hidden="true" />
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1 text-center md:items-start md:text-left">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                  {profileData.name || "Hospital Name"}
                </h1>
                <p className="flex items-center gap-2 font-medium text-muted">
                  <Building2 size={14} aria-hidden="true" />
                  {profileData.type || "General Hospital"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <Badge tone="success">
                    <CheckCircle2 size={12} aria-hidden="true" /> Verified
                  </Badge>
                  <Badge tone="hospital">
                    <ShieldCheck size={12} aria-hidden="true" /> Accredited
                  </Badge>
                </div>
              </div>

              <div className="z-10 shrink-0">
                {isEditing ? (
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleEditToggle} icon={X}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} icon={Save}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleEditToggle} icon={Pencil}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex w-fit gap-1 self-center rounded-xl bg-surface-hover p-1.5 md:self-start">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-surface text-primary shadow-card"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Hospital Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("credentials")}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "credentials"
                  ? "bg-surface text-primary shadow-card"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Professional Credentials
            </button>
          </div>

          {/* Form section */}
          <Card as="section" aria-label="Hospital form">
            <CardBody className="p-6 md:p-8">
              <div className="mx-auto max-w-4xl">
                {activeTab === "profile" && (
                  <div className="animate-fade-in grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <ProfileField
                        label="Hospital Name"
                        value={profileData.name}
                        onChange={handleChange}
                        name="name"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ProfileField
                        label="Hospital Address"
                        value={profileData.address}
                        onChange={handleChange}
                        name="address"
                        disabled={!isEditing}
                      />
                    </div>
                    <ProfileField
                      label="Phone Number"
                      value={profileData.phone_no}
                      onChange={handleChange}
                      name="phone_no"
                      disabled={!isEditing}
                    />
                    <ProfileField
                      label="Website URL"
                      value={profileData.website}
                      onChange={handleChange}
                      name="website"
                      disabled={!isEditing}
                    />
                  </div>
                )}

                {activeTab === "credentials" && (
                  <div className="animate-fade-in grid grid-cols-1 gap-5 md:grid-cols-2">
                    <ProfileField
                      label="License Number"
                      value={profileData.license_no}
                      onChange={handleChange}
                      name="license_no"
                      disabled={!isEditing}
                    />
                    <ProfileField
                      label="Facility Type"
                      value={profileData.type}
                      onChange={handleChange}
                      name="type"
                      disabled={!isEditing}
                    />
                    <ProfileField
                      label="Founded Date"
                      type="date"
                      value={formatDateForInput(profileData.founded_on)}
                      onChange={handleChange}
                      name="founded_on"
                      disabled={!isEditing}
                    />
                    <ProfileField
                      label="License Expiry"
                      type="date"
                      value={formatDateForInput(profileData.license_valid_till)}
                      onChange={handleChange}
                      name="license_valid_till"
                      disabled={!isEditing}
                    />

                    <div className="md:col-span-2 md:mt-2 md:border-t md:border-border md:pt-5">
                      <DocumentUpload
                        docPreview={docPreview}
                        fileType={fileType}
                        isEditing={isEditing}
                        onView={() => setIsViewModalOpen(true)}
                        onRemove={removeFile}
                        onFileChange={(file) =>
                          setProfileData({ ...profileData, verification_documents: file })
                        }
                        tone="hospital"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
