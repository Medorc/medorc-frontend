import { useState } from "react";

import { User, Edit3, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import { Card, CardHeader, CardBody } from "./ui/Card";
import { Input, Select, Textarea } from "./ui/Field";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";

function StaticValue({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
      <div className="rounded-xl bg-surface-hover px-3.5 py-2.5 text-sm font-medium text-muted">
        {children || "Not Specified"}
      </div>
    </div>
  );
}

export default function PersonalDetails({ data, isEditing, onChange, onPhotoUpdate }) {
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString, forInput = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    if (forInput) return date.toISOString().split("T")[0];
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      const photoUrl = res.data.url;
      toast.success("Profile photo uploaded!");
      if (onPhotoUpdate) {
        onPhotoUpdate(photoUrl);
      } else {
        onChange({ target: { id: "photo", value: photoUrl } });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error(err.response?.data?.error || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (onPhotoUpdate) {
      onPhotoUpdate("");
    } else {
      onChange({ target: { id: "photo", value: "" } });
    }
    toast.info("Photo removed. Click Save to apply changes.");
  };

  return (
    <Card
      as="section"
      aria-label="Personal profile"
      className={`relative overflow-hidden ${isEditing ? "ring-2 ring-primary/25 ring-offset-2 ring-offset-background" : ""}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1.5 ${isEditing ? "bg-primary" : "bg-border"}`}
        aria-hidden="true"
      />

      <CardHeader
        title="Personal Profile"
        description="Basic information, blood group, and avatar"
        icon={User}
        action={
          isEditing ? (
            <span className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary-soft-fg">
              <Edit3 size={12} aria-hidden="true" />
              Editing Mode
            </span>
          ) : undefined
        }
      />

      <CardBody className="pt-6">
        <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Form fields */}
          <div className="w-full flex-1">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                {isEditing ? (
                  <Input
                    id="full_name"
                    label="Full Name"
                    value={data.full_name || ""}
                    onChange={onChange}
                  />
                ) : (
                  <StaticValue label="Full Name">{data.full_name}</StaticValue>
                )}
              </div>

              {isEditing ? (
                <Input
                  id="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  value={formatDate(data.date_of_birth, true)}
                  onChange={onChange}
                />
              ) : (
                <StaticValue label="Date of Birth">{formatDate(data.date_of_birth)}</StaticValue>
              )}

              {isEditing ? (
                <Select
                  id="gender"
                  label="Gender"
                  value={data.gender || ""}
                  onChange={onChange}
                >
                  <option value="">Select Gender</option>
                  {["Male", "Female", "Other"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              ) : (
                <StaticValue label="Gender">{data.gender}</StaticValue>
              )}

              {isEditing ? (
                <Select
                  id="blood_group"
                  label="Blood Group"
                  value={data.blood_group || ""}
                  onChange={onChange}
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              ) : (
                <StaticValue label="Blood Group">{data.blood_group}</StaticValue>
              )}

              <div className="md:col-span-2">
                {isEditing ? (
                  <Textarea
                    id="address"
                    label="Address"
                    rows={4}
                    value={data.address || ""}
                    onChange={onChange}
                  />
                ) : (
                  <StaticValue label="Address">{data.address}</StaticValue>
                )}
              </div>
            </div>
          </div>

          {/* Profile photo */}
          <div className="flex shrink-0 flex-col items-center gap-4 lg:pt-6">
            <div className="relative">
              <div
                className={`absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary to-teal-400 blur-md transition-opacity duration-300 ${isEditing ? "opacity-50" : "opacity-20"}`}
                aria-hidden="true"
              />
              <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-surface shadow-card sm:h-40 sm:w-40">
                {data.photo ? (
                  <img src={data.photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-hover">
                    <User size={48} className="text-subtle" aria-hidden="true" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                    <Spinner size="sm" className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                  <Upload size={14} aria-hidden="true" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
                {data.photo && (
                  <Button variant="danger-soft" size="sm" onClick={handleRemovePhoto} icon={Trash2}>
                    Remove
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
