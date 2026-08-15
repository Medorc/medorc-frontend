
import { FiCheckCircle, FiUploadCloud, FiFile } from "react-icons/fi";
import { Spinner } from "./ui/Spinner";

const fieldBase =
  "w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-subtle transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/35";

function FieldLabel({ id, label, required }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
      {label}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function FieldInput({
  id,
  name,
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${fieldBase} h-11 ${className}`}
      />
    </div>
  );
}

export function FieldTextarea({
  id,
  name,
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 2,
  className = "",
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`${fieldBase} resize-none py-2.5 ${className}`}
      />
    </div>
  );
}

export function FieldSelect({
  id,
  name,
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${fieldBase} h-11 appearance-none pr-9 ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-subtle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function FieldCheckbox({ name, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 appearance-none rounded-md border border-border bg-surface transition-colors checked:border-primary checked:bg-primary"
        />
        <svg
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

export function DocUpload({ state, uploadedUrl, onUpload, label, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          uploadedUrl ? "border-success/50 bg-success-soft" : "border-border bg-surface hover:border-primary/40"
        }`}
      >
        {uploadedUrl ? (
          <div className="flex flex-col items-center text-success">
            <FiCheckCircle size={28} aria-hidden="true" />
            <span className="mt-1 text-sm font-semibold">Document Uploaded</span>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-xs font-medium text-primary underline"
            >
              View
            </a>
          </div>
        ) : state === "uploading" ? (
          <Spinner size="sm" className="text-primary" />
        ) : (
          <>
            <FiUploadCloud size={26} className="mb-2 text-subtle" aria-hidden="true" />
            <p className="mb-3 text-xs text-muted">{hint || "PDF, JPG or PNG"}</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-soft-fg transition-colors hover:bg-primary/15">
              <FiFile size={14} aria-hidden="true" />
              Choose File
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onUpload} />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
