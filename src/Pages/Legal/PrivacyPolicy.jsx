import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "../../Components/ThemeToggle";

export default function PrivacyPolicy() {
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
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted">Last Updated: October 2026</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h2>
            <p className="text-muted text-sm">
              Medorc collects user account information (such as name, email, role, phone number, and medical credentials)
              as well as health records explicitly uploaded by users or authorized healthcare providers.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">2. How We Use Health Data</h2>
            <p className="text-muted text-sm">
              Your health data is used solely to provide health orchestration services: generating your Smart Health Card (SHC),
              enabling consent-based access for your doctors and hospitals, and powering Orby AI summaries upon your request.
              We do not sell personal or health data to any third party.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">3. Consent & Access Control</h2>
            <p className="text-muted text-sm">
              Access to patient records is granted exclusively through verified authentication and explicit user consent.
              Patients can review access logs and revoke diagnostic or doctor permissions at any time.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">4. Security & Encryption</h2>
            <p className="text-muted text-sm">
              We employ industry-standard encryption protocols for data in transit (TLS 1.3) and sensitive data at rest.
              Access tokens are securely generated and verified on every API request.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-surface border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">5. Contact Us</h2>
            <p className="text-muted text-sm">
              If you have any questions regarding this Privacy Policy or your data, please contact us at{" "}
              <a href="mailto:privacy@medorc.in" className="text-primary hover:underline font-medium">
                privacy@medorc.in
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
