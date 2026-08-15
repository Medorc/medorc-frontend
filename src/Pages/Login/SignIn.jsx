import { useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiLock, FiMail, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { API_BASE_URL } from "../../config/api";
import AuthLayout from "../../Components/AuthLayout";
import { Button } from "../../Components/ui/Button";

const roles = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "extern", label: "External" },
];

export default function SignIn() {
  const { login, shcstore } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({ role: "", email: "", password: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const changehandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { role, email, password } = data;
    if (!email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, data);
      if (response.status === 200) {
        toast.success("Login Successful");
        login(response.data.token, response.data.role);
        if (response.data.role === "patient") {
          shcstore(response.data.shc_code);
        }
        navigate(`/${role}/home`);
      }
    } catch (error) {
      console.error("SignIn Error Details:", error);
      toast.error(
        error.response?.data?.error || error.response?.data?.message || error.message || "Login Failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back — access your health dashboard.">
      <form onSubmit={handlesubmit} className="flex flex-col gap-5">
        {/* Role select */}
        <div className="relative">
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-foreground">
            Sign In as
          </label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 text-sm transition-all hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/35"
          >
            <span className={data.role ? "font-medium text-foreground" : "text-subtle"}>
              {roles.find((r) => r.value === data.role)?.label || "Select your role"}
            </span>
            <FiChevronDown
              size={16}
              className={`text-subtle transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                role="listbox"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-pop"
              >
                <div>
                  {roles.map((role) => (
                    <li key={role.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setData((prev) => ({ ...prev, role: role.value }));
                          setIsDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                      >
                        <span>{role.label}</span>
                        {data.role === role.value && (
                          <FiCheck size={15} className="text-primary" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <FiMail
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={changehandle}
              placeholder="Enter your email"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 text-sm text-foreground placeholder:text-subtle transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <FiLock
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={changehandle}
              placeholder="Enter your password"
              className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-sm text-foreground placeholder:text-subtle transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition-colors hover:text-foreground"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full" loading={submitting}>
          Sign In
        </Button>
      </form>

      <div className="mt-7 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
        <p className="cursor-pointer font-medium text-primary hover:underline">Forgot password?</p>
        <p className="text-muted">
          Not a user?{" "}
          <button
            type="button"
            onClick={() => navigate("/SignUp")}
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
