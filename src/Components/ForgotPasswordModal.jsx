import React, { useState } from "react";
import { FiX, FiMail, FiLock, FiKey, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Button } from "./ui/Button";
import { PasswordHealthCheck } from "./PasswordHealthCheck";

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "extern", label: "External" },
];

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Email/Role, 2: OTP & New Password
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error("Please provide email address and select role.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email, role });
      toast.success(res.data.message || "A 6-digit verification code has been sent!");
      if (res.data.otp) {
        setOtp(res.data.otp);
        toast.info(`[Verification Code]: ${res.data.otp} (Sent to ${email})`);
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Please enter the OTP code and your new password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        role,
        otp,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful! You can now log in.");
      onClose();
      // Reset modal state
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-pop sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-subtle hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiKey size={24} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Forgot Password</h2>
            <p className="text-xs text-muted">
              {step === 1 ? "Step 1: Verify your account email" : "Step 2: Enter OTP & new password"}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                      role === r.value
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-background text-muted hover:border-primary/40"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Registered Email
              </label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter account email"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" loading={loading}>
              Send Reset Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                6-Digit Reset OTP Code
              </label>
              <div className="relative">
                <FiCheckCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 font-mono tracking-widest"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                New Password
              </label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <PasswordHealthCheck password={newPassword} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="w-2/3" loading={loading}>
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
