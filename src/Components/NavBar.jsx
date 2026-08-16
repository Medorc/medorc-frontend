import { useState, useEffect, useRef } from "react";

import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  PlusCircle,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  History,
  PhoneCall,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";

const ROLE_META = {
  patient: { label: "Patient", tone: "patient" },
  doctor: { label: "Doctor", tone: "doctor" },
  hospital: { label: "Hospital", tone: "hospital" },
};

export default function NavBar() {
  const { role, user, profileData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = profileData?.full_name || profileData?.name || user?.full_name || user?.name || user?.email?.split('@')[0] || "Medorc User";

  const meta = ROLE_META[role] || { label: "Account", tone: "neutral" };

  const navLinks = (() => {
    if (role === "patient") {
      return [
        { to: "/patient/home", label: "Home", icon: Home },
        { to: "/patient/records", label: "Records", icon: FileText },
        { to: "/patient/addrecord", label: "Add Record", icon: PlusCircle },
      ];
    }
    if (role === "doctor" || role === "hospital" || role === "extern") {
      return [
        { to: `/${role}/home`, label: "Home", icon: Home },
        { to: `/${role}/profile`, label: "Profile", icon: User },
      ];
    }
    return [];
  })();

  const closeAll = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeAll();
    logout();
    navigate("/");
  };

  const go = (to) => {
    closeAll();
    navigate(to);
  };

  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  useEffect(() => {
    if (!dropdownOpen && !menuOpen) return;
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeAll();
    };
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen, menuOpen]);

  const settingsItem = (
    <div className="space-y-1">
      <p className="border-b border-border px-4 py-3">
        <span className="block truncate text-sm font-bold text-foreground">
          {displayName}
        </span>
        <span className="mt-0.5 block text-xs uppercase tracking-wider text-subtle">
          {meta.label} Account
        </span>
      </p>
      <button
        onClick={() => go(`/${role}/profile`)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <User size={16} className="text-patient" />
        Personal Profile
      </button>
      <button
        onClick={() => go(`/${role}/security`)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <Settings size={16} className="text-hospital" />
        Account &amp; Security
      </button>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );

  if (!role) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => go(`/${role}/home`)}
          className="group flex items-center gap-3"
          aria-label="Go to dashboard"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
            <img
              src="/favicon.png"
              alt="Medorc Logo"
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="flex flex-col text-left leading-tight sm:flex">
            <span className="font-display text-base font-extrabold tracking-tight text-foreground">
              MEDORC
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Health Orchestrator
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active =
              location.pathname === to || (to !== `/${role}/home` && location.pathname.startsWith(to));
            return (
              <button
                key={to}
                type="button"
                onClick={() => go(to)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary-soft text-primary-soft-fg"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Badge tone={meta.tone} className="hidden md:inline-flex">
            <ShieldCheck size={12} aria-hidden="true" />
            {meta.label}
          </Badge>

          {/* Avatar dropdown (desktop) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1 pl-1 pr-2 shadow-card transition-colors hover:border-primary/40"
            >
              <Avatar src={profileData?.photo} name={displayName} size={32} />
              <ChevronDown size={14} className="text-subtle" aria-hidden="true" />
            </button>
            {dropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 origin-top-right animate-slide-down rounded-2xl border border-border bg-surface py-1.5 shadow-pop"
              >
                {settingsItem}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-card transition-colors hover:text-primary md:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div ref={menuRef} className="border-t border-border bg-surface px-4 pb-5 pt-2 md:hidden">
          <nav aria-label="Mobile primary" className="space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active =
                location.pathname === to ||
                (to !== `/${role}/home` && location.pathname.startsWith(to));
              return (
                <button
                  key={to}
                  type="button"
                  onClick={() => go(to)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary-soft text-primary-soft-fg"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="mt-2 border-t border-border pt-2">
            <button
              type="button"
              onClick={() => go(`/${role}/profile`)}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <User size={17} className="text-patient" aria-hidden="true" />
              Personal Profile
            </button>
            <button
              type="button"
              onClick={() => go(`/${role}/security`)}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Settings size={17} className="text-hospital" aria-hidden="true" />
              Account &amp; Security
            </button>
            {role === "patient" && (
              <>
                <button
                  type="button"
                  onClick={() => go("/patient/emergency")}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  <PhoneCall size={17} className="text-warning" aria-hidden="true" />
                  Emergency Contacts
                </button>
                <button
                  type="button"
                  onClick={() => go("/patient/logs")}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  <History size={17} className="text-info" aria-hidden="true" />
                  Activity Logs
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
            >
              <LogOut size={17} aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
