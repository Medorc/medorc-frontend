import { useState, useEffect } from "react";

import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMail, FiPhone, FiLock, FiShield, FiCamera } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { Card, CardBody } from "./ui/Card";
import { Button } from "./ui/Button";
import { Avatar } from "./ui/Avatar";
import { ConfirmDialog } from "./ui/ConfirmDialog";

export default function ProfileChange({ data }) {
  const { token, role } = useAuth();

  const [profile, setProfile] = useState({
    email: data.email || "",
    phone: data.phone_no || "",
    password: "",
    photo: data.photo || "",
  });
  const [confirmField, setConfirmField] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      email: data.email || "",
      phone: data.phone_no || "",
      photo: data.photo || "",
    }));
  }, [data]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const changeHandler = async (field) => {
    const payload = {};
    if (field === "email") payload.newEmail = profile.email;
    else if (field === "phone") payload.newPhone = profile.phone;
    else if (field === "password") payload.newPassword = profile.password;
    else payload.newPhoto = profile.photo;

    setConfirmField(null);
    setUpdating(true);
    try {
      await axios.patch(`${API_BASE_URL}/${role}/profile/${field}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(`${field.replace("_", " ")} updated successfully`);
      if (field === "password") setProfile((p) => ({ ...p, password: "" }));
    } catch (err) {
      toast.error("API Error: " + (err.response?.data?.error || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/cloudinary/photo`, formData);
      setProfile((p) => ({ ...p, photo: res.data.url }));
      await axios.patch(
        `${API_BASE_URL}/${role}/profile/photo`,
        { newPhoto: res.data.url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Photo updated successfully!");
    } catch (error) {
      console.error("Photo upload error response:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Photo upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const fields = [
    {
      key: "email",
      label: "Email Address",
      name: "email",
      type: "email",
      value: profile.email,
      placeholder: "name@example.com",
      icon: FiMail,
      confirm: "Are you sure you want to update your email?",
    },
    {
      key: "phone",
      label: "Phone Number",
      name: "phone",
      type: "tel",
      value: profile.phone,
      placeholder: "+1 (555) 000-0000",
      icon: FiPhone,
      confirm: "Are you sure you want to update your phone?",
    },
    {
      key: "password",
      label: "New Password",
      name: "password",
      type: "password",
      value: profile.password,
      placeholder: "Enter new password",
      icon: FiLock,
      confirm: "Are you sure you want to update your password?",
    },
  ];

  return (
    <div className="w-full max-w-4xl px-4 pb-12">
      <Card className="overflow-hidden">
        <div className="relative">
          <div aria-hidden="true" className="h-28 bg-gradient-to-r from-primary-soft via-info-soft to-patient-soft" />
          <div className="px-6 pb-6 sm:px-10">
            <div className="relative mt-[-3rem] flex flex-col items-center gap-5 sm:flex-row sm:items-end">
              <div className="relative">
                <Avatar src={profile.photo} name={data.full_name} size={104} className="border-4 border-surface" />
                <label
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted shadow-card transition-colors hover:text-primary"
                  aria-label="Change profile photo"
                >
                  {uploadingPhoto ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <FiCamera size={14} aria-hidden="true" />
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {role === "doctor" ? "Dr. " : ""}
                  {data.full_name || "User Account"}
                </h3>
                <p className="mt-0.5 text-sm uppercase tracking-wider text-muted">
                  {role || "User Role"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-fg sm:ml-auto">
                <FiShield size={12} aria-hidden="true" />
                Security &amp; Access Controls
              </span>
            </div>
          </div>
        </div>

        <CardBody className="flex flex-col gap-6 border-t border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Account &amp; Security</h2>

          {fields.map(({ key, label, name, type, value, placeholder, icon: Icon }) => (
            <div key={key} className="group">
              <label htmlFor={`sec-${name}`} className="mb-2 ml-1 block text-sm font-semibold text-foreground">
                {label}
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Icon
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
                    aria-hidden="true"
                  />
                  <input
                    id={`sec-${name}`}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => setConfirmField(key)}
                >
                  Change
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmField === "email" || confirmField === "phone" || confirmField === "password"}
        title="Confirm update"
        description={fields.find((f) => f.key === confirmField)?.confirm}
        confirmLabel="Update"
        tone="primary"
        loading={updating}
        onConfirm={() => changeHandler(confirmField)}
        onCancel={() => setConfirmField(null)}
      />
    </div>
  );
}
