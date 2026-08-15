
import { FiDownload } from "react-icons/fi";
import { Modal } from "./ui/Modal";

const downloadTones = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  hospital: "bg-hospital text-white hover:opacity-90",
  extern: "bg-extern text-white hover:opacity-90",
};

export default function DocumentPreviewModal({ open, docPreview, fileType, onClose, tone = "primary" }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Document Preview"
      description="View or download your verification document"
      size="xl"
      footer={
        <a
          href={docPreview}
          download="document"
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${downloadTones[tone] || downloadTones.primary}`}
        >
          <FiDownload size={15} aria-hidden="true" />
          Download / Open New Tab
        </a>
      }
    >
      <div className="flex h-[65vh] w-full items-center justify-center overflow-auto rounded-xl border border-border bg-background p-4">
        {fileType === "pdf" ? (
          <iframe src={docPreview} title="Document Viewer" className="h-full w-full rounded-lg border border-border" />
        ) : (
          <img src={docPreview} alt="Full preview" className="max-h-full max-w-full rounded-md object-contain shadow-card" />
        )}
      </div>
    </Modal>
  );
}
