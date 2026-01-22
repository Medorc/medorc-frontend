import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  FaStethoscope, FaHospital, FaUserMd, FaUser, FaPhoneAlt, 
  FaEnvelope, FaMapMarkerAlt, FaIdBadge, FaGlobe, FaVenusMars 
} from "react-icons/fa";
import { FiCalendar, FiClock, FiEye, FiX } from "react-icons/fi";

export default function RecordCard({ record }) {
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const navigate = useNavigate(); 

  // --- LOGIC TO IDENTIFY CREATOR ---
  const entryType = record.entry_type || "";
  const isDoctor = entryType.includes("Doctor");
  const isHospital = entryType.includes("Hospital");
  // Robust check for Self/Patient
  const isSelf = entryType.includes("Self") || (!isDoctor && !isHospital);

  const displayType = entryType.replace(" Entry", "") || "N/A";

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

  // --- HELPER TO EXTRACT DETAILS ---
  const getCreatorDetails = () => {
    // Debugging: Check if backend is actually sending the objects
    // console.log("Record:", record.record_id, "Doctor:", record.doctor, "Hospital:", record.hospital);

    // 1. SELF / PATIENT
    if (isSelf) {
      return {
        role: "Patient (Self)",
        themeColor: "gray",
        photo: record.patient?.photo,
        fallbackIcon: <FaUser className="text-gray-400 text-5xl" />,
        name: record.patient?.full_name || "You",
        details: [
            { icon: <FaEnvelope/>, label: "Email", value: record.patient?.email },
            { icon: <FaPhoneAlt/>, label: "Phone", value: record.patient?.phone_no },
            { icon: <FaVenusMars/>, label: "Gender", value: record.patient?.gender },
            { icon: <FaMapMarkerAlt/>, label: "Address", value: record.patient?.address },
            { icon: <FiCalendar/>, label: "Date Added", value: formatDate(record.created_at) }
        ]
      };
    }

    // 2. DOCTOR
    if (record.doctor) {
      // Handle Specializations (can be string or array)
      const specs = record.doctor.specializations || record.doctor.specialization;
      const formattedSpecs = Array.isArray(specs) ? specs.join(", ") : specs;

      return {
        role: "Doctor",
        themeColor: "blue",
        photo: record.doctor.photo,
        fallbackIcon: <FaUserMd className="text-blue-500 text-5xl" />,
        name: record.doctor.full_name || record.doctor_name || "Unknown Doctor",
        details: [
          { icon: <FaIdBadge/>, label: "Specialization", value: formattedSpecs },
          { icon: <FaEnvelope/>, label: "Email", value: record.doctor.email },
          { icon: <FaPhoneAlt/>, label: "Phone", value: record.doctor.phone_no }
        ]
      };
    } 
    
    // 3. HOSPITAL
    if (record.hospital) {
      return {
        role: "Hospital",
        themeColor: "red",
        photo: record.hospital.photo,
        fallbackIcon: <FaHospital className="text-red-500 text-5xl" />,
        name: record.hospital.name || record.hospital_name || "Unknown Hospital",
        details: [
          { icon: <FaMapMarkerAlt/>, label: "Address", value: record.hospital.address },
          { icon: <FaEnvelope/>, label: "Email", value: record.hospital.email },
          { icon: <FaPhoneAlt/>, label: "Phone", value: record.hospital.phone_no },
          { icon: <FaGlobe/>, label: "Website", value: record.hospital.website }
        ]
      };
    } 

    // 4. FALLBACK (If data objects are missing in DB but entry type is Doctor/Hospital)
    return {
        role: displayType,
        themeColor: isDoctor ? "blue" : "red",
        photo: null,
        fallbackIcon: isDoctor ? <FaUserMd className="text-blue-500 text-5xl" /> : <FaHospital className="text-red-500 text-5xl" />,
        name: isDoctor ? (record.doctor_name || "Unknown Doctor") : (record.hospital_name || "Unknown Hospital"),
        details: [
            // Add a placeholder so it's not completely empty if we at least have a name
            { icon: <FaUser/>, label: "Note", value: "Contact details not linked in database." }
        ]
    };
  };

  const creator = getCreatorDetails();
  
  // Tag Logic
  const tags = [];
  if (record.is_hospitalized) tags.push("Hospitalization");
  if (record.is_surgery) tags.push("Surgery");

  // Dynamic Styles
  const badgeColors = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-100 text-gray-700 border-gray-200",
      green: "bg-green-50 text-green-700 border-green-200"
  };
  const headerColors = {
      blue: "bg-gradient-to-r from-blue-500 to-blue-600",
      red: "bg-gradient-to-r from-red-500 to-red-600",
      gray: "bg-gradient-to-r from-gray-700 to-gray-800",
      green: "bg-gradient-to-r from-emerald-500 to-emerald-600"
  };

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50 relative group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {record.diagnosis_name || "Diagnosis"}
          </h3>

          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isDoctor
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : isSelf 
                  ? "bg-gray-50 text-gray-600 border-gray-100" 
                  : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {isDoctor ? <FaStethoscope size={10} /> : isSelf ? <FaUser size={10} /> : <FaHospital size={10} />}
            {displayType}
          </span>

          {/* Eye Icon Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowCreatorInfo(true);
            }}
            className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-colors"
            title="View Creator Details"
          >
            <FiEye size={14} />
          </button>
        </div>

        <button 
          onClick={() => navigate(`/recordview/${record.record_id}`)}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-white bg-gray-50 text-gray-700 transition-colors"
        >
          View
        </button>
      </div>

      {/* Date & Time */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6 pb-2">
        <div className="flex items-center gap-1.5">
          <FiCalendar className="text-gray-400"/>
          {formatDate(record.appointment_date)}
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock className="text-gray-400"/>
          {formatTime(record.created_at)}
        </div>
      </div>

      {/* Doctor & Hospital Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Doctor</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {record.doctor_name || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Hospital</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {record.hospital_name || "N/A"}
          </p>
        </div>
      </div>

      {/* Illness */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider py-1">
         History of present illness
        </p>
        <p className="text-sm text-gray-700 line-clamp-2">
          {record.history_of_present_illness || "—"}
        </p>
      </div>

      {/* Footer Tags */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto pt-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                tag === "Hospitalization"
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "bg-purple-50 text-purple-600 border border-purple-200"
              }`}
            >
              {tag}
            </span>
          ))}

          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-medium">
            {record.document_count || 0} Document(s)
          </span>
        </div>

        <p className="text-xs text-gray-400 font-medium">
          Reg: {record.reg_no || "N/A"}
        </p>
      </div>
    </div>

      {/* ========================================= */}
      {/* CREATOR PROFILE MODAL (POPUP)         */}
      {/* ========================================= */}
      {showCreatorInfo && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                e.stopPropagation();
                setShowCreatorInfo(false);
            }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-28 w-full ${headerColors[creator.themeColor] || headerColors.gray} relative`}>
                 <button 
                  onClick={() => setShowCreatorInfo(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                >
                  <FiX size={20} />
                </button>
            </div>

            <div className="relative px-6 flex flex-col items-center -mt-14">
                <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    {creator.photo ? (
                        <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                    ) : (
                        creator.fallbackIcon
                    )}
                </div>
                
                <h3 className="mt-3 text-xl font-bold text-gray-900 text-center">{creator.name}</h3>
                <span className={`mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${badgeColors[creator.themeColor] || badgeColors.gray}`}>
                    {creator.role}
                </span>
            </div>

            <div className="p-6 space-y-4">
                {creator.details.map((detail, index) => (
                    detail.value && (
                        <div key={index} className="flex items-start gap-3.5">
                            <div className={`mt-0.5 p-2 rounded-lg bg-gray-50 text-gray-500`}>
                                {detail.icon}
                            </div>
                            <div className="flex-1 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                    {detail.label}
                                </p>
                                <p className="text-sm font-medium text-gray-800 break-words">
                                    {detail.value}
                                </p>
                            </div>
                        </div>
                    )
                ))}
                
                {creator.details.every(d => !d.value) && (
                     <div className="text-center py-6 text-gray-400">
                        <p className="italic text-sm">No contact details found.</p>
                     </div>
                )}
            </div>
            
            {/* 4. Close Button */}
            <div className="p-6 pt-0">
                <button 
                    onClick={() => setShowCreatorInfo(false)}
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-transform active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                    Close Profile
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}