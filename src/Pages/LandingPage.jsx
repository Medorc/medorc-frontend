import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { ThemeToggle } from "../Components/ThemeToggle";
import { Button } from "../Components/ui/Button";
import {
  QrCode,
  ShieldCheck,
  Bot,
  Lock,
  Activity,
  Phone,
  User,
  Stethoscope,
  Building2,
  Microscope,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Layers,
  HeartHandshake,
  KeyRound,
  FileSpreadsheet
} from "lucide-react";

const ROLES = [
  {
    icon: User,
    roleKey: "patient",
    label: "Patients",
    badge: "Personal Health",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accentColor: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    description: "Manage your complete health history, store prescriptions, and securely share your digital Smart Health Card (SHC) with verified doctors via QR.",
    signupLink: "/signup/patient",
    points: ["One Unified Smart Health Card", "Emergency Contacts & Logs", "AI-assisted Record Insights"]
  },
  {
    icon: Stethoscope,
    roleKey: "doctor",
    label: "Doctors",
    badge: "Clinical Care",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    accentColor: "text-teal-600 dark:text-teal-400",
    borderHover: "hover:border-teal-500/50 hover:shadow-teal-500/10",
    description: "Access authorized patient health records in real-time, write electronic prescriptions, review medical logs, and coordinate patient care seamlessly.",
    signupLink: "/signup/doctor",
    points: ["Instant SHC Profile Scan", "Clinical Diagnosis & Add Record", "Secure Patient History View"]
  },
  {
    icon: Building2,
    roleKey: "hospital",
    label: "Hospitals",
    badge: "Enterprise",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    accentColor: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    description: "Centralize institutional patient records, streamline emergency admissions, manage departmental doctor privileges, and ensure ABDM compliance.",
    signupLink: "/signup/hospital",
    points: ["Institutional Records Management", "Departmental Verification", "Centralized Care Coordination"]
  },
  {
    icon: Microscope,
    roleKey: "extern",
    label: "External Entities",
    badge: "Diagnostics & Labs",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    accentColor: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    description: "Diagnostic laboratories, pharmacies, and external clinics can upload authorized test reports and view scoped patient data with consent.",
    signupLink: "/signup/external",
    points: ["Scoped Diagnostic Uploads", "Time-bound Consent Access", "Instant Patient Record Linking"]
  }
];

const FEATURES = [
  {
    icon: QrCode,
    title: "Smart Health Card (SHC)",
    description: "Every patient receives a unique digital SHC code and QR code for rapid, secure clinical identification without physical paperwork."
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    description: "Granular permissions ensure patients control access, doctors view clinical timelines, and institutions operate with full auditability."
  },
  {
    icon: Bot,
    title: "Orby AI Health Intelligence",
    description: "Interactive AI assistant capable of answering medical queries, navigating record timelines, and helping understand health summaries."
  },
  {
    icon: Lock,
    title: "Consent-Driven Security",
    description: "End-to-end security protocols ensure records are only accessed with explicit user authorization and authenticated tokens."
  },
  {
    icon: Activity,
    title: "ABDM-Ready Architecture",
    description: "Built according to modern digital health standards to facilitate unified interoperability between clinics, labs, and hospitals."
  },
  {
    icon: Phone,
    title: "Instant Emergency Access",
    description: "Configured emergency contacts and vital emergency tags ensure first responders can access life-critical medical info promptly."
  }
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Create Your Digital Profile",
    description: "Register as a Patient, Doctor, Hospital, or Diagnostic entity in under two minutes with instant role-specific credentials.",
    icon: KeyRound
  },
  {
    step: "02",
    title: "Generate Smart Health Code",
    description: "Receive your encrypted SHC code and QR badge, ready to be scanned across clinics and partner health facilities.",
    icon: QrCode
  },
  {
    step: "03",
    title: "Orchestrate & Access Data",
    description: "Seamlessly upload prescriptions, view lab reports, track medical history, and consult with AI-assisted health intelligence.",
    icon: FileSpreadsheet
  }
];

export default function LandingPage() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // If already authenticated, automatically navigate to role dashboard
  useEffect(() => {
    if (token && role) {
      navigate(`/${role}/home`, { replace: true });
    }
  }, [token, role, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      {/* Sticky Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-surface/85 backdrop-blur-md border-b border-border shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/Logo.png" alt="Medorc Logo" className="h-7 w-auto object-contain" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground hidden sm:inline-block">
              Med<span className="text-primary">orc</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#portals" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Role Portals
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#security" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Security
            </a>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/signin")}
              className="text-xs sm:text-sm font-semibold"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/signup")}
              className="text-xs sm:text-sm font-semibold shadow-md shadow-primary/20"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border bg-surface text-muted hover:text-foreground focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-4 shadow-lg"
            >
              <div className="flex flex-col space-y-3">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground py-2 px-3 rounded-lg hover:bg-surface-hover"
                >
                  Features
                </a>
                <a
                  href="#portals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground py-2 px-3 rounded-lg hover:bg-surface-hover"
                >
                  Role Portals
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground py-2 px-3 rounded-lg hover:bg-surface-hover"
                >
                  How it Works
                </a>
                <a
                  href="#security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground py-2 px-3 rounded-lg hover:bg-surface-hover"
                >
                  Security
                </a>
              </div>
              <div className="pt-3 border-t border-border flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signin");
                  }}
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup");
                  }}
                  className="w-full justify-center shadow-md shadow-primary/20"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Mesh Glows */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:32px_32px] text-muted/30 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-gradient-to-tr from-primary/30 to-emerald-400/20 blur-3xl -z-10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 right-10 w-[24rem] h-[24rem] rounded-full bg-blue-500/15 blur-3xl -z-10 pointer-events-none"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary-soft-fg text-xs font-semibold tracking-wide border border-primary/20 mb-6 shadow-sm"
          >
            <Sparkles size={14} />
            Unified Digital Health Ecosystem
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
          >
            Your health, orchestrated in{" "}
            <span className="relative inline-block text-primary">
              one place.
              <svg
                className="absolute left-0 -bottom-2 w-full h-3 text-primary/30 fill-none"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-muted max-w-3xl mx-auto leading-relaxed"
          >
            Unified Smart Health Cards, instant QR access, and AI-powered record management.
            Empowering patients, doctors, hospitals, and diagnostics in a secure, consent-driven network.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 shadow-lg shadow-primary/25 text-base font-semibold group"
            >
              Get Started Free
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/signin")}
              className="w-full sm:w-auto px-8 text-base font-semibold"
            >
              Sign In to Account
            </Button>
          </motion.div>

          {/* Trust Highlights Grid (Qualitative and Accurate) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border shadow-card flex flex-col items-center text-center">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
                <Layers size={20} />
              </span>
              <span className="text-sm font-bold text-foreground">4 Unified Roles</span>
              <span className="text-xs text-muted mt-0.5">Patient, Doctor, Hospital, Lab</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border shadow-card flex flex-col items-center text-center">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
                <Bot size={20} />
              </span>
              <span className="text-sm font-bold text-foreground">AI Intelligence</span>
              <span className="text-xs text-muted mt-0.5">Orby Smart Assistant</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border shadow-card flex flex-col items-center text-center">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                <ShieldCheck size={20} />
              </span>
              <span className="text-sm font-bold text-foreground">ABDM Ready</span>
              <span className="text-xs text-muted mt-0.5">Interoperable Architecture</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border shadow-card flex flex-col items-center text-center">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                <Lock size={20} />
              </span>
              <span className="text-sm font-bold text-foreground">Encrypted Data</span>
              <span className="text-xs text-muted mt-0.5">Explicit Consent-Based Access</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role Portals Section ("Who is Medorc for?") */}
      <section id="portals" className="py-20 bg-surface/40 border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Designed For The Entire Health Ecosystem
            </h2>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Who is Medorc for?
            </h3>
            <p className="mt-3 text-base text-muted">
              Dedicated portals with tailored workflows for every participant in modern healthcare delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLES.map((roleItem, idx) => {
              const Icon = roleItem.icon;
              return (
                <motion.div
                  key={roleItem.roleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`flex flex-col justify-between p-6 rounded-2xl bg-surface border border-border shadow-card transition-all duration-200 ${roleItem.borderHover}`}
                >
                  <div>
                    {/* Top Role Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-surface-hover ${roleItem.accentColor}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${roleItem.badgeColor}`}>
                        {roleItem.badge}
                      </span>
                    </div>

                    <h4 className="font-display text-xl font-bold text-foreground mb-2">
                      {roleItem.label}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                      {roleItem.description}
                    </p>

                    {/* Bullet Highlights */}
                    <ul className="space-y-2 mb-6 border-t border-border pt-4">
                      {roleItem.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs text-foreground/80 font-medium">
                          <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${roleItem.accentColor}`} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal CTA */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(roleItem.signupLink)}
                    className="w-full justify-between group text-xs font-semibold hover:border-primary"
                  >
                    <span>Register as {roleItem.label}</span>
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1 text-muted" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Platform Capabilities
            </h2>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Engineered for Seamless Healthcare
            </h3>
            <p className="mt-3 text-base text-muted">
              Built from the ground up with secure data standards, AI assistance, and high-performance workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-surface border border-border shadow-card hover:shadow-pop transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-soft-fg flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-surface/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Simple 3-Step Setup
            </h2>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              How Medorc Works
            </h3>
            <p className="mt-3 text-base text-muted">
              Getting started is effortless whether you are an individual patient or a hospital administrator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className="relative p-8 rounded-2xl bg-surface border border-border shadow-card"
                >
                  <div className="text-4xl font-extrabold font-display text-primary/20 mb-4">
                    {step.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-hover text-foreground flex items-center justify-center mb-4 border border-border">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Privacy Banner */}
      <section id="security" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
            {/* Background Accents */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
            />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4">
                <ShieldCheck size={14} />
                Enterprise Grade Privacy
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Your Health Data Belongs to You.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-teal-100/80 leading-relaxed">
                We believe privacy is a fundamental right. All health documents are encrypted, access logs are auditable,
                and no doctor or hospital can view your records without authenticated authorization.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate("/signup")}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Create Your Account
                </Button>
                <Link
                  to="/privacy"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-teal-200 hover:text-white transition-colors"
                >
                  Read Privacy Policy <ArrowRight size={16} className="ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <img src="/Logo.png" alt="Medorc Logo" className="h-7 w-auto object-contain" />
                <span className="font-display font-bold text-lg text-foreground">
                  Med<span className="text-primary">orc</span>
                </span>
              </Link>
              <p className="text-xs text-muted leading-relaxed">
                Next-generation health data orchestration platform connecting patients, healthcare providers, and diagnostic networks.
              </p>
            </div>

            {/* Quick Portals */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Role Portals
              </h5>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <Link to="/signup/patient" className="hover:text-primary transition-colors">
                    Patient Registration
                  </Link>
                </li>
                <li>
                  <Link to="/signup/doctor" className="hover:text-primary transition-colors">
                    Doctor Registration
                  </Link>
                </li>
                <li>
                  <Link to="/signup/hospital" className="hover:text-primary transition-colors">
                    Hospital Registration
                  </Link>
                </li>
                <li>
                  <Link to="/signup/external" className="hover:text-primary transition-colors">
                    Diagnostic & Lab Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform links */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Platform
              </h5>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <Link to="/signin" className="hover:text-primary transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-primary transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Key Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-primary transition-colors">
                    How it Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Legal & Trust
              </h5>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@medorc.in" className="hover:text-primary transition-colors">
                    Contact Support (support@medorc.in)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
            <p>© {new Date().getFullYear()} Medorc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with care for universal digital healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
