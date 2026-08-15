
import {
  FiUploadCloud,
  FiEye,
  FiFile,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";

const tones = {
  primary: {
    chip: "bg-primary-soft text-primary",
    icon: "text-primary",
    dashed: "border-primary/40 bg-primary-soft/40 hover:border-primary hover:bg-primary-soft",
    hint: "text-primary",
    label: "text-primary",
  },
  hospital: {
    chip: "bg-hospital-soft text-hospital",
    icon: "text-hospital",
    dashed: "border-hospital/40 bg-hospital-soft/40 hover:border-hospital hover:bg-hospital-soft",
    hint: "text-hospital",
    label: "text-hospital",
  },
  extern: {
    chip: "bg-extern-soft text-extern",
    icon: "text-extern",
    dashed: "border-extern/40 bg-extern-soft/40 hover:border-extern hover:bg-extern-soft",
    hint: "text-extern",
    label: "text-extern",
  },
};

export default function DocumentUpload({
  docPreview,
  fileType = "image",
  isEditing,
  onView,
  onRemove,
  onFileChange,
  tone = "primary",
}) {
  const t = tones[tone] || tones.primary;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
        <FiUploadCloud className={t.icon} aria-hidden="true" />
        Verification Documents
      </label>

      {docPreview ? (
        <div className="flex flex-wrap items-start gap-4">
          {/* Preview thumbnail */}
          <div
            role="button"
            tabIndex={0}
            onClick={onView}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onView?.();
              }
            }}
            aria-label="View document"
            className="group relative h-40 w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-hover shadow-card transition-shadow hover:shadow-lift"
          >
            {fileType === "image" ? (
              <img src={docPreview} alt="Document thumbnail" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-hover text-subtle">
                <FiFile size={40} className="text-danger" aria-hidden="true" />
                <span className="text-xs font-medium">PDF Document</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-sm font-semibold text-white opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
              <FiEye size={18} aria-hidden="true" />
              View
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(e);
                }}
                aria-label="Remove document"
                className="absolute right-2 top-2 z-20 rounded-lg bg-surface p-1.5 text-danger shadow-sm transition-colors hover:bg-danger-soft"
              >
                <FiTrash2 size={12} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="min-w-[200px] flex-1 space-y-1 pt-1">
            <p className="text-sm font-semibold text-foreground">Document Uploaded</p>
            <p className="text-xs text-muted">Click the thumbnail to view full details.</p>
            {isEditing && <p className={`mt-2 text-xs font-medium ${t.hint}`}>To replace, remove this file first.</p>}
          </div>
        </div>
      ) : (
        <div
          className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 p-8 text-center transition-all ${
            isEditing ? `${t.dashed} cursor-pointer` : "border-border bg-surface-hover opacity-70"
          }`}
        >
          {isEditing ? (
            <>
              <input
                type="file"
                aria-label="Upload verification document"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="image/*, application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileChange(file);
                }}
              />
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface shadow-sm ${t.icon}`}>
                <FiUploadCloud size={24} aria-hidden="true" />
              </div>
              <p className="font-medium text-foreground">Click to upload credentials</p>
              <p className={`mt-1 text-sm ${t.hint}`}>PDF, JPG or PNG (Max 5MB)</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${t.chip}`}>
                <FiFileText size={20} aria-hidden="true" />
              </div>
              <p className="font-medium text-muted">No documents uploaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
