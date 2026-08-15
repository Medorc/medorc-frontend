import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../Components/NavBar";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";
import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import { Loading } from "../../Components/Loading";
import PersonalDetails from "../../Components/PersonalDetails";
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
  Info,
} from "lucide-react";

import { API_BASE_URL } from "../../config/api";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

export default function ExternProfile() {
  const { token, role } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const [profile, setProfile] = useState({});
  const [organization, setOrganization] = useState({});
  const [originalOrganization, setOriginalOrganization] = useState({});

  const [isEditingOrg, setIsEditingOrg] = useState(false);

  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/extern/profile/personal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = { ...response.data.data, address: response.data.data.org_address };
      setProfile(data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getOrganization = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/extern/profile/organization`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = { ...response.data.data, address: response.data.data.org_address };
      setOrganization(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || role !== "extern") navigate("/");
    else {
      getProfile();
      getOrganization();
    }
  }, [token, role, navigate, getProfile, getOrganization]);

  useEffect(() => {
    const currentDoc = organization.verification_documents;

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
  }, [organization.verification_documents]);

  const handleOrgEdit = () => {
    setOriginalOrganization({ ...organization });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setOrganization(originalOrganization);
    setIsEditingOrg(false);
    setDocPreview(null);
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

  const handleOrgSave = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...organization };

      if (dataToSend.verification_documents instanceof File) {
        const fileUrl = await uploadImageToCloudinary(dataToSend.verification_documents);

        if (!fileUrl) {
          setLoading(false);
          return;
        }

        dataToSend.verification_documents = fileUrl;
      }

      await axios.patch(
        `${API_BASE_URL}/extern/profile/documents`,
        { newDocument: dataToSend.verification_documents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      delete dataToSend.address;
      delete dataToSend.verification_documents;

      const response = await axios.patch(
        `${API_BASE_URL}/extern/profile/organization`,
        { newOrganizationCredentials: dataToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      setIsEditingOrg(false);
      setOrganization(response.data.data);
      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization details");
      setLoading(false);
    }
  };

  const handleOrgChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        setOrganization({ ...organization, verification_documents: file });
      }
    } else {
      setOrganization({ ...organization, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setOrganization({ ...organization, verification_documents: null });
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
        tone="extern"
      />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PersonalDetails data={profile} />

          {/* Organization header card */}
          <Card as="section" aria-label="Organization overview" className="relative overflow-hidden p-6 md:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-extern/10 blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-hover shadow-card sm:h-36 sm:w-36">
                <Building2 size={56} className="text-extern" aria-hidden="true" />
              </div>

              <div className="flex w-full flex-1 flex-col items-center gap-1 text-center md:items-start md:text-left">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                  {organization.org_name || "Organization Name"}
                </h1>
                <p className="flex items-center gap-2 font-medium capitalize text-muted">
                  <Info size={14} className="text-extern" aria-hidden="true" />
                  {organization.org_type || "Organization Type"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <Badge tone="success">
                    <CheckCircle2 size={12} aria-hidden="true" /> Verified
                  </Badge>
                  <Badge tone="extern">
                    <ShieldCheck size={12} aria-hidden="true" /> Partner
                  </Badge>
                </div>
              </div>

              <div className="z-10 flex w-full shrink-0 justify-center md:w-auto">
                {isEditingOrg ? (
                  <div className="flex w-full gap-3 md:w-auto">
                    <Button variant="secondary" className="flex-1 md:flex-none" onClick={handleOrgCancel} icon={X}>
                      Cancel
                    </Button>
                    <Button className="flex-1 md:flex-none" onClick={handleOrgSave} icon={Save}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full md:w-auto" onClick={handleOrgEdit} icon={Pencil}>
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
              onClick={() => setActiveTab("details")}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "details"
                  ? "bg-surface text-primary shadow-card"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Organization Details
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
              Credentials & Docs
            </button>
          </div>

          {/* Main content card */}
          <Card as="section" aria-label="Organization form">
            <CardBody className="p-6 md:p-8">
              <div className="mx-auto max-w-4xl">
                {activeTab === "details" && (
                  <div className="animate-fade-in grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <ProfileField
                        label="Organization Name"
                        value={organization.org_name}
                        onChange={handleOrgChange}
                        name="org_name"
                        disabled={!isEditingOrg}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ProfileField
                        label="Registered Address"
                        value={organization.org_address}
                        onChange={handleOrgChange}
                        name="org_address"
                        disabled={!isEditingOrg}
                      />
                    </div>
                    <ProfileField
                      label="Type"
                      value={organization.org_type}
                      onChange={handleOrgChange}
                      name="org_type"
                      disabled={!isEditingOrg}
                    />
                    <ProfileField
                      label="Website URL"
                      value={organization.org_website}
                      onChange={handleOrgChange}
                      name="org_website"
                      disabled={!isEditingOrg}
                    />
                    <div className="md:col-span-2">
                      <div>
                        <p className="mb-1.5 text-sm font-medium text-foreground">Description</p>
                        {isEditingOrg ? (
                          <textarea
                            className="min-h-32 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
                            value={organization.org_description || ""}
                            onChange={(e) => handleOrgChange(e, "org_description")}
                            placeholder="Brief description of the organization..."
                            rows={4}
                          />
                        ) : (
                          <div className="min-h-32 rounded-xl bg-surface-hover px-3.5 py-2.5 text-sm font-medium text-muted">
                            {organization.org_description || "—"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "credentials" && (
                  <div className="animate-fade-in grid grid-cols-1 gap-5 md:grid-cols-2">
                    <ProfileField
                      label="License Number"
                      value={organization.org_license_no}
                      onChange={handleOrgChange}
                      name="org_license_no"
                      disabled={!isEditingOrg}
                    />
                    <ProfileField
                      label="License Valid Till"
                      type="date"
                      value={formatDateForInput(organization.org_license_valid_till)}
                      onChange={handleOrgChange}
                      name="org_license_valid_till"
                      disabled={!isEditingOrg}
                    />
                    <ProfileField
                      label="Founded On"
                      type="date"
                      value={formatDateForInput(organization.org_founded_on)}
                      onChange={handleOrgChange}
                      name="org_founded_on"
                      disabled={!isEditingOrg}
                    />

                    <div className="md:col-span-2 md:mt-2 md:border-t md:border-border md:pt-5">
                      <DocumentUpload
                        docPreview={docPreview}
                        fileType={fileType}
                        isEditing={isEditingOrg}
                        onView={() => setIsViewModalOpen(true)}
                        onRemove={removeFile}
                        onFileChange={(file) =>
                          setOrganization({ ...organization, verification_documents: file })
                        }
                        tone="extern"
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
