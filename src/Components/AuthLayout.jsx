
import { Link } from "react-router-dom";
import { ShieldCheck, QrCode, Bot, Lock, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const FEATURES = [
  { icon: QrCode, text: "One secure SHC code for your entire health history" },
  { icon: ShieldCheck, text: "Role-based access for patients, doctors & hospitals" },
  { icon: Bot, text: "Orby — your AI-powered health assistant" },
  { icon: Lock, text: "Encrypted, consent-based record sharing" },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-950 via-teal-900 to-slate-900 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.5)_1px,transparent_0)] [background-size:28px_28px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
        />

        <div className="relative z-10 p-8 lg:p-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center rounded-2xl bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-xl border border-white/40 transition-transform hover:scale-105"
            title="Back to Landing Page"
          >
            <img src="/Logo.png" alt="Medorc Logo" className="h-10 w-auto object-contain" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-teal-100 hover:bg-white/20 hover:text-white transition-all ring-1 ring-white/20 backdrop-blur-md"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <div className="relative z-10 px-8 pb-10 lg:px-10">
          <h1 className="max-w-md font-display text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white">
            Your health, orchestrated in one place.
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-teal-100/90">
            Connect with doctors, manage records, and share access securely — through a single
            Smart Health Code.
          </p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-100 ring-1 ring-white/20">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-teal-50/95">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right content */}
      <main className="flex w-full flex-col items-center justify-center px-4 py-4 sm:py-6 lg:py-4 lg:px-8 lg:w-1/2 relative">
        {/* Top bar controls on right side */}
        <div className="w-full max-w-md flex items-center justify-between mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted shadow-2xs hover:text-foreground hover:border-primary/40 transition-all group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-3 lg:hidden">
          <Link to="/" className="inline-flex items-center rounded-2xl bg-surface px-4 py-2 shadow-md border border-border">
            <img src="/Logo.png" alt="Medorc Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-4 text-center lg:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-xs sm:text-sm text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
