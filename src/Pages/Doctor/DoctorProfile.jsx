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
import { Card, CardHeader, CardBody } from "../../Components/ui/Card";
import { Button } from "../../Components/ui/Button";
import { Award, Save, Pencil, X } from "lucide-react";

import { API_BASE_URL } from "../../config/api";

export default function DoctorProfile() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [credentials, setCredentials] = useState({});

  const [docPreview, setDocPreview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileType, setFileType] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getOrganization = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctor/profile/credentials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredentials(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    if (!token || role !== "doctor") {
      navigate("/");
      return;
    }
    getProfile();
    getOrganization();
  }, [token, role, navigate, getProfile, getOrganization]);

  useEffect(() => {
    const currentDoc =
      credentials.verification_documents || credentials.org_verification_documents;

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
  }, [credentials]);

  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [originalOrganization, setOriginalOrganization] = useState({});

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

  const handleOrgEdit = () => {
    setOriginalOrganization({ ...credentials });
    setIsEditingOrg(true);
  };

  const handleOrgCancel = () => {
    setCredentials(originalOrganization);
    setIsEditingOrg(false);
    setDocPreview(null);
  };

  const handleOrgSave = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...credentials };

      if (dataToSend.verification_documents instanceof File) {
        const fileUrl = await uploadImageToCloudinary(dataToSend.verification_documents);

        if (!fileUrl) {
          setLoading(false);
          return;
        }

        dataToSend.verification_documents = fileUrl;

        try {
          await axios.patch(
            `${API_BASE_URL}/doctor/profile/documents`,
            { newDocument: fileUrl },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (docErr) {
          console.error("Doc update error", docErr);
        }
      }

      if (dataToSend.years_of_experience) {
        dataToSend.years_of_experience = parseInt(dataToSend.years_of_experience, 10);
      }

      delete dataToSend.verification_documents;

      const response = await axios.patch(
        `${API_BASE_URL}/doctor/profile/credentials`,
        { newCredentials: dataToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      setIsEditingOrg(false);
      setCredentials(response.data.data);
      toast.success("Organization details updated successfully");
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
        setCredentials({ ...credentials, verification_documents: file });
      }
    } else {
      setCredentials({ ...credentials, [field]: e.target.value });
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setCredentials({ ...credentials, verification_documents: null });
  };

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
      />

      {loading ? (
        <Loading />
      ) : (
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <PersonalDetails data={profile} />

            <Card as="section" aria-label="Professional credentials">
              <CardHeader
                title="Professional Credentials"
                description="License, experience, and hospital affiliations"
                icon={Award}
                action={
                  isEditingOrg ? (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={handleOrgCancel} icon={X}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleOrgSave} icon={Save}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button variant="primarySoft" size="sm" onClick={handleOrgEdit} icon={Pencil}>
                      Edit Credentials
                    </Button>
                  )
                }
              />

              <CardBody className="pt-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <ProfileField
                    label="License Number"
                    value={credentials.license_no}
                    onChange={handleOrgChange}
                    name="license_no"
                    disabled={!isEditingOrg}
                  />
                  <ProfileField
                    label="Experience (Years)"
                    type="number"
                    value={credentials.years_of_experience}
                    onChange={handleOrgChange}
                    name="years_of_experience"
                    disabled={!isEditingOrg}
                  />
                  <ProfileField
                    label="Current Affiliation"
                    value={credentials.hospital_affiliation}
                    onChange={handleOrgChange}
                    name="hospital_affiliation"
                    disabled={!isEditingOrg}
                  />
                  <ProfileField
                    label="Specialization"
                    value={credentials.specialization || credentials.specializations}
                    onChange={handleOrgChange}
                    name="specialization"
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
                        setCredentials({ ...credentials, verification_documents: file })
                      }
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
}
