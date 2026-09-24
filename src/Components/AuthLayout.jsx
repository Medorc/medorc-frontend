
import { ShieldCheck, QrCode, Bot, Lock } from "lucide-react";

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

        <div className="relative z-10 p-8 lg:p-10">
          <div className="inline-flex items-center rounded-2xl bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-xl border border-white/40">
            <img src="/Logo.png" alt="Medorc Logo" className="h-10 w-auto object-contain" />
          </div>
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
      <main className="flex w-full flex-col items-center justify-center px-4 py-4 sm:py-6 lg:py-4 lg:px-8 lg:w-1/2">
        <div className="mb-4 lg:hidden">
          <div className="inline-flex items-center rounded-2xl bg-surface px-4 py-2 shadow-md border border-border">
            <img src="/Logo.png" alt="Medorc Logo" className="h-8 w-auto object-contain" />
          </div>
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
