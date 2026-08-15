
import { Phone, User, Heart, AlertCircle, ShieldAlert, MapPin } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

export default function EmergencyContacts({ emergency }) {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-danger-soft p-2.5 text-danger">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Emergency Contacts</h2>
          <p className="text-sm text-muted">Primary contacts in case of emergency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {emergency && emergency.length > 0 ? (
          emergency.map((contact, index) => (
            <Card
              key={index}
              className="group p-6 transition-all hover:-translate-y-0.5 hover:border-danger/30 hover:shadow-lift"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-xl font-bold text-primary">
                  {contact.full_name ? (
                    contact.full_name[0].toUpperCase()
                  ) : (
                    <User size={20} aria-hidden="true" />
                  )}
                </div>
                <Badge tone="danger">
                  <Heart size={10} fill="currentColor" aria-hidden="true" />
                  {contact.relation || "Kin"}
                </Badge>
              </div>

              <div className="mb-4">
                <h3 className="truncate font-display text-lg font-bold text-foreground">
                  {contact.full_name || "Unknown Name"}
                </h3>
                <p className="text-xs font-medium text-subtle">Full Name</p>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                {contact.phone_no && (
                  <a
                    href={`tel:${contact.phone_no}`}
                    className="flex items-center gap-3 rounded-xl bg-surface-hover p-3 font-semibold text-foreground transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <div className="rounded-full bg-surface p-1.5 text-muted shadow-card">
                      <Phone size={14} aria-hidden="true" />
                    </div>
                    {contact.phone_no}
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-center gap-3 rounded-xl bg-surface-hover p-3 text-sm text-muted">
                    <div className="rounded-full bg-surface p-1.5 shadow-card">
                      <MapPin size={14} aria-hidden="true" />
                    </div>
                    {contact.address}
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface-hover/50 py-16 text-subtle">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface shadow-card">
              <AlertCircle size={32} className="text-subtle" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-semibold text-muted">No contacts found</p>
            <p className="text-sm">Patient has not added any emergency contacts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
