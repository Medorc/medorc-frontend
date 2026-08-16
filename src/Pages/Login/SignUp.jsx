import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaHospital, FaUserTie } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import AuthLayout from "../../Components/AuthLayout";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "182757837191-4s59cohflfr6sil012r0g4ma5t1vimeb.apps.googleusercontent.com";

const roleOptions = [
  {
    label: "Patient",
    path: "/signup/patient",
    icon: FaUserInjured,
    description: "Manage your health records securely",
    tone: "patient",
  },
  {
    label: "Doctor",
    path: "/signup/doctor",
    icon: FaUserMd,
    description: "Join as a healthcare professional",
    tone: "doctor",
  },
  {
    label: "Hospital",
    path: "/signup/hospital",
    icon: FaHospital,
    description: "Register your healthcare facility",
    tone: "hospital",
  },
  {
    label: "External",
    path: "/signup/external",
    icon: FaUserTie,
    description: "External partner or viewer access",
    tone: "extern",
  },
];

const toneStyles = {
  patient: "bg-patient-soft text-patient",
  doctor: "bg-doctor-soft text-doctor",
  hospital: "bg-hospital-soft text-hospital",
  extern: "bg-extern-soft text-extern",
};

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const gEmail = searchParams.get("google_email");
    const gName = searchParams.get("google_name");
    const gPhoto = searchParams.get("google_photo");
    if (gEmail) sessionStorage.setItem("google_email", gEmail);
    if (gName) sessionStorage.setItem("google_name", gName);
    if (gPhoto) sessionStorage.setItem("google_photo", gPhoto);
  }, [searchParams]);

  const handleGoogleSignUpSuccess = (credentialResponse) => {
    try {
      const payloadBase64 = credentialResponse.credential.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      const email = decoded.email || "";
      const name = decoded.name || "";
      const photo = decoded.picture || "";

      sessionStorage.setItem("google_email", email);
      sessionStorage.setItem("google_name", name);
      sessionStorage.setItem("google_photo", photo);

      toast.success("Google account verified! Select your account type below.");
    } catch {
      toast.error("Failed to decode Google credentials.");
    }
  };

  const handleRoleSelect = (basePath) => {
    const gEmail = searchParams.get("google_email") || sessionStorage.getItem("google_email") || "";
    const gName = searchParams.get("google_name") || sessionStorage.getItem("google_name") || "";
    const gPhoto = searchParams.get("google_photo") || sessionStorage.getItem("google_photo") || "";

    if (gEmail || gName || gPhoto) {
      const params = new URLSearchParams({
        google_email: gEmail,
        google_name: gName,
        google_photo: gPhoto,
      }).toString();
      navigate(`${basePath}?${params}`);
    } else {
      navigate(basePath);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthLayout
        title="Create Account"
        subtitle="Select your account type or sign up with Google"
      >
        <div className="mb-5 flex flex-col items-center justify-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Quick Sign Up with Google
          </p>
          <GoogleLogin
            onSuccess={handleGoogleSignUpSuccess}
            onError={() => toast.error("Google Sign-Up failed")}
            shape="pill"
            theme="outline"
            text="signup_with"
            size="large"
          />
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-subtle">
            Or Select Account Type
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {roleOptions.map((role) => (
            <button
              key={role.label}
              type="button"
              onClick={() => handleRoleSelect(role.path)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${toneStyles[role.tone]}`}
              >
                <role.icon size={22} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground">{role.label}</h3>
                <p className="text-sm text-muted">{role.description}</p>
              </div>
              <FiArrowRight
                size={18}
                className="shrink-0 text-subtle transition-all group-hover:translate-x-1 group-hover:text-primary"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </button>
        </p>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
}
