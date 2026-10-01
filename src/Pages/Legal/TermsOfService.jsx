import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { ThemeToggle } from "../../Components/ThemeToggle";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Medorc
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-primary-soft text-primary-soft-fg">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-muted">Last Updated: October 2026</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted text-sm">
              By accessing or using the Medorc platform, you agree to be bound by these Terms of Service
              and all applicable healthcare laws and regulations.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">2. User Accounts & Responsibilities</h2>
            <p className="text-muted text-sm">
              Healthcare providers (Doctors, Hospitals, Labs) represent that they hold valid medical licenses
              and certifications. Users are responsible for safeguarding account credentials and maintaining accurate information.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">3. Medical Disclaimer</h2>
            <p className="text-muted text-sm">
              Medorc is a health data orchestration platform. The Orby AI chatbot provides informational guidance
              and summary assistance only and is not a replacement for emergency care or formal professional medical advice.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">4. Platform Availability & Support</h2>
            <p className="text-muted text-sm">
              We strive for high uptime and data integrity. For technical assistance or account inquiries,
              reach out to{" "}
              <a href="mailto:support@medorc.in" className="text-primary hover:underline font-medium">
                support@medorc.in
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
