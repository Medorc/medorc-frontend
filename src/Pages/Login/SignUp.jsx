import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaHospital, FaUserTie } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import AuthLayout from "../../Components/AuthLayout";

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

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Select your account type to complete registration"
    >
      <div className="flex flex-col gap-2.5">
        {roleOptions.map((role) => (
          <button
            key={role.label}
            type="button"
            onClick={() => navigate(role.path)}
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
  );
}
