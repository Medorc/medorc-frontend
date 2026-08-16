import { useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 Minutes (HIPAA Compliance)

export function useInactivityLogout() {
  const { token, logout } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        toast.info("Session expired due to 15 minutes of inactivity for health data privacy.");
        logout();
      }, INACTIVITY_LIMIT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, logout]);
}
