
import { FaStethoscope, FaHospital } from "react-icons/fa";
import { FiCalendar, FiClock, FiEye } from "react-icons/fi";


export default function RecordCard({ record }) {
  const isDoctor = record.entry_type?.includes("Doctor");
  const displayType = record.entry_type?.replace(" Entry", "") || "N/A";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";

  const tags = [];
  if (record.is_hospitalized) tags.push("Hospitalization");
  if (record.is_surgery) tags.push("Surgery");

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">
            {record.diagnosis_name || "Diagnosis"}
          </h3>

          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isDoctor
                ? "bg-blue-50 text-blue-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isDoctor ? <FaStethoscope size={10} /> : <FaHospital size={10} />}
            {displayType}
          </span>

          <span className="p-1 rounded-full bg-green-50 text-green-600">
            <FiEye size={14} />
          </span>
        </div>

        <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 cursor-pointer">
          View Details
        </button>
      </div>

      {/* Date & Time */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1.5">
          <FiCalendar />
          {formatDate(record.appointment_date)}
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock />
          {formatTime(record.created_at)}
        </div>
      </div>

      {/* Doctor & Hospital */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">Doctor</p>
          <p className="text-sm font-semibold text-gray-900">
            {record.doctor_name || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">Hospital</p>
          <p className="text-sm font-semibold text-gray-900">
            {record.hospital_name || "N/A"}
          </p>
        </div>
      </div>

      {/* Illness */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-medium mb-1">
         History of present illness
        </p>
        <p className="text-sm text-gray-700">
          {record.history_of_present_illness || "—"}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center  sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                tag === "Hospitalization"
                  ? "bg-orange-45 text-orange-600 border-2 border-orange-300"
                  : "bg-purple-45 text-purple-600 border-2 border-purple-300"
              }`}
            >
              {tag}
            </span>
          ))}

          <span className="px-3 py-1 text-xs rounded-full bg-blue-45 text-blue-600 border-2 border-blue-300">
            {record.document_count || 0} Document(s)
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Reg: {record.reg_no || "N/A"}
        </p>
      </div>
    </div>
  );
};