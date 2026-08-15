import { useState, useEffect } from "react";

import NavBar from "../../Components/NavBar";
import NavButton from "../../Components/NavButton";
import BackButton from "../../Components/BackButton";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../../Components/PersonalDetails";
import { Card, CardHeader, CardBody } from "../../Components/ui/Card";
import { Textarea } from "../../Components/ui/Field";
import { Button } from "../../Components/ui/Button";
import {
  Cigarette,
  Wine,
  Coffee,
  Activity,
  Baby,
  Save,
  Pencil,
  Check,
} from "lucide-react";

const lifestyleConfig = [
  { key: "smoking", label: "Smoking", icon: Cigarette, tone: "warning" },
  { key: "alcoholism", label: "Alcohol", icon: Wine, tone: "info" },
  { key: "tobacco", label: "Tobacco", icon: Coffee, tone: "extern" },
  { key: "exercise", label: "Exercise", icon: Activity, tone: "success" },
  { key: "pregnancy", label: "Pregnancy", icon: Baby, tone: "danger" },
];

const toneClasses = {
  warning: "border-warning bg-warning-soft text-warning",
  info: "border-info bg-info-soft text-info",
  extern: "border-extern bg-extern-soft text-extern",
  success: "border-success bg-success-soft text-success",
  danger: "border-danger bg-danger-soft text-danger",
};

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [data, setData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    address: "",
    photo: "",
    smoking: false,
    alcoholism: false,
    tobacco: false,
    exercise: false,
    pregnancy: false,
    others: "",
    allergy: "",
  });

  const [isLifestyleEditing, setIsLifestyleEditing] = useState(false);
  const [isPersonalEditing, setIsPersonalEditing] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingLifestyle, setSavingLifestyle] = useState(false);

  const urlPersonal = `${API_BASE_URL}/patient/profile/personal`;
  const urlLifestyle = `${API_BASE_URL}/patient/profile/lifestyle`;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(urlPersonal, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setData(res.data.data);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [token, urlPersonal]);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setData((prev) => ({ ...prev, photo: newPhotoUrl }));
  };

  const toggleLifestyleEdit = async () => {
    if (!isLifestyleEditing) {
      setIsLifestyleEditing(true);
      return;
    }
    setSavingLifestyle(true);
    try {
      await axios.patch(urlLifestyle, { newLifestyle: data }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lifestyle updated successfully!");
      setIsLifestyleEditing(false);
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingLifestyle(false);
    }
  };

  const togglePersonalEdit = async () => {
    if (!isPersonalEditing) {
      setIsPersonalEditing(true);
      return;
    }
    setSavingPersonal(true);
    try {
      await axios.patch(
        urlPersonal,
        {
          full_name: data.full_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          blood_group: data.blood_group,
          address: data.address,
          photo: data.photo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Personal details updated successfully!");
      setIsPersonalEditing(false);
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleTileClick = (key) => {
    if (!isLifestyleEditing) return;
    handleChange({
      target: { id: key, type: "checkbox", checked: !data[key] },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <NavBar />

      <div className="mb-8 flex w-full flex-col items-center">
        <BackButton />
        <NavButton />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-8">
          {/* Personal Details Section */}
          <div className="relative">
            <PersonalDetails
              data={data}
              isEditing={isPersonalEditing}
              onChange={handleChange}
              onPhotoUpdate={handlePhotoUpdate}
            />
            <button
              type="button"
              onClick={togglePersonalEdit}
              disabled={savingPersonal}
              aria-label={
                isPersonalEditing ? "Save personal details" : "Edit personal details"
              }
              title={isPersonalEditing ? "Save Personal Details" : "Edit Personal Details"}
              className={`absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-lift transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 ${
                isPersonalEditing
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-muted hover:text-foreground"
              }`}
            >
              {savingPersonal ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPersonalEditing ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Pencil size={16} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Lifestyle Section */}
          <Card as="section" aria-label="Lifestyle and habits">
            <CardHeader
              title="Lifestyle & Habits"
              description="Manage medical alerts and history"
              icon={Activity}
              action={
                <Button
                  variant={isLifestyleEditing ? "primary" : "secondary"}
                  size="sm"
                  onClick={toggleLifestyleEdit}
                  loading={savingLifestyle}
                  icon={isLifestyleEditing ? Save : Pencil}
                >
                  {isLifestyleEditing ? "Save" : "Edit"}
                </Button>
              }
            />

            <CardBody className="flex flex-col gap-8 pt-6">
              {/* Habits tiles */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {lifestyleConfig.map(({ key, label, icon: Icon, tone }) => {
                  const isActive = data[key] || false;
                  return (
                    <div
                      key={key}
                      role={isLifestyleEditing ? "checkbox" : undefined}
                      aria-checked={isLifestyleEditing ? isActive : undefined}
                      tabIndex={isLifestyleEditing ? 0 : undefined}
                      onClick={() => handleTileClick(key)}
                      onKeyDown={(e) => {
                        if (
                          isLifestyleEditing &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          handleTileClick(key);
                        }
                      }}
                      className={`relative flex select-none flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
                        isLifestyleEditing
                          ? "cursor-pointer hover:scale-[1.02] active:scale-95"
                          : "cursor-default"
                      } ${
                        isActive
                          ? `${toneClasses[tone]} shadow-sm`
                          : "border-border bg-surface text-subtle"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={key}
                        checked={isActive}
                        readOnly
                        className="hidden"
                      />
                      {isActive && (
                        <div className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-current" />
                      )}
                      <Icon size={28} className="mb-1" aria-hidden="true" />
                      <span className="text-sm font-semibold">{label}</span>
                      <span className="text-[10px] font-medium opacity-80">
                        {isActive ? "Active" : "None"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Other habits & allergies */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <Textarea
                  id="others"
                  label="Other Habits"
                  rows={5}
                  value={data.others || ""}
                  onChange={handleChange}
                  readOnly={!isLifestyleEditing}
                  placeholder={
                    isLifestyleEditing
                      ? "Enter other habits..."
                      : "No additional habits recorded."
                  }
                  className={!isLifestyleEditing ? "bg-surface-hover" : ""}
                />
                <Textarea
                  id="allergy"
                  label="Allergies"
                  rows={5}
                  value={data.allergy || ""}
                  onChange={handleChange}
                  readOnly={!isLifestyleEditing}
                  placeholder={
                    isLifestyleEditing
                      ? "List allergies here..."
                      : "No known allergies."
                  }
                  className={!isLifestyleEditing ? "bg-surface-hover" : ""}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
