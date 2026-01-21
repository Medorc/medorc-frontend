import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";
import Loading from "../../Components/Loading";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function RecordView() {
  const { record_id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const url = "http://localhost:3000";

  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [hospitalization, setHospitalization] = useState(null);
  const [surgery, setSurgery] = useState(null);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    if (!token || !record_id) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch main record list to find the basic details (including reg_no)
        const recordRes = await axios.post(
          `${url}/api/v1/patient/records`,
          { searchOptions: { sort_by: "Time Desc", entry_type: "All" }, searchQuery: "" },
          { headers }
        );

        const currentRecord = recordRes.data?.data?.find(r => r.record_id === record_id);
        if (!currentRecord) throw new Error("Record not found");
        setRecord(currentRecord);

        // 2. Fetch parallel sub-details using the CORRECT backend routes
        // Backend expects: /api/v1/patient/records/:record_id/:details_type
        const [hospRes, surgRes, docRes] = await Promise.allSettled([
          currentRecord.is_hospitalized
            ? axios.get(`${url}/api/v1/patient/records/${record_id}/hospitalization`, { headers })
            : Promise.reject(),
          currentRecord.is_surgery
            ? axios.get(`${url}/api/v1/patient/records/${record_id}/surgery`, { headers })
            : Promise.reject(),
          axios.get(`${url}/api/v1/patient/records/${record_id}/documents`, { headers })
        ]);

        // 3. Update state if the requests were successful
        if (hospRes.status === "fulfilled") setHospitalization(hospRes.value.data);
        if (surgRes.status === "fulfilled") setSurgery(surgRes.value.data);
        if (docRes.status === "fulfilled") setDocuments(docRes.value.data);

      } catch (err) {
        console.error("Failed to load record details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [record_id, token]);

  if (loading) return <Loading />;
  if (!record) return <div className="p-10 text-center">Record not found.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 font-sans">
      <NavBar />

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm mt-8 mb-12 p-10 relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoMdClose size={28} />
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {record.diagnosis_name}
            </h1>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-xs font-bold border border-blue-100 uppercase tracking-wide">
              {record.entry_type}
            </span>
            <FaEye className="text-green-500 text-xl" title="Visible" />
          </div>
          <p className="text-sm text-gray-400 font-medium py-2">
            Detailed medical record information
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="w-full bg-gray-100 p-1.5 rounded-lg flex mb-10">
          {["General", "Treatment", "Procedures", "Documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all duration-300 ${activeTab === tab
                ? "bg-white text-gray-900 shadow-sm translate-y-0"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: General */}
        {activeTab === "General" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section className="mb-12">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-8 pb-2 pt-2 border-l-4 border-blue-500 pl-3">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10">
                {/* Row 1 */}
                <div className="flex flex-col p-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">Entry Type</span>
                  <span className="text-base font-semibold text-gray-700">{record.entry_type}</span>
                </div>
                <div className="flex flex-col p-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">Appointment Date</span>
                  <span className="text-base font-semibold text-gray-700">
                    {record.appointment_date
                      ? new Date(record.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : "N/A"
                    }
                  </span>
                </div>
                <div className="flex flex-col p-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">Registration No</span>
                  {/* Matches backend 'reg_no' field */}
                  <span className="text-base font-semibold text-gray-700">{record.reg_no || "N/A"}</span>
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-gray-100 mb-12"></div>

            <section>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-8 border-l-4 border-blue-500 pl-3 py-2">
                Healthcare Provider
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col p-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">Doctor Name</span>
                  <span className="text-lg font-bold text-gray-900">Dr. {record.doctor_name || "N/A"}</span>
                </div>
                <div className="flex flex-col p-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">Hospital</span>
                  <span className="text-base font-semibold text-gray-700">{record.hospital_name || "N/A"}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab Content: Treatment */}
        {activeTab === "Treatment" && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">History of present illness</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-700 leading-relaxed italic">
                "{record.history_of_present_illness || "No history logged."}"
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Treatment Undergone</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-700 leading-relaxed">
                {record.treatment_undergone || "Ongoing observation."}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Procedures (Hospitalization & Surgery) */}
        {activeTab === "Procedures" && (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitalization ? (
              <div className="p-6 bg-orange-50/40 border border-orange-100 rounded-xl h-fit">
                <h3 className="font-bold text-orange-800 mb-4">Hospitalization Details</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-gray-500">Duration:</span> {hospitalization.duration}</p>
                  <p><span className="text-gray-500">Room No:</span> {hospitalization.room_no}</p>
                  <p><span className="text-gray-500">Reason:</span> {hospitalization.reason}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm italic">No hospitalization records found.</p>
              </div>
            )}

            {surgery ? (
              <div className="p-6 bg-purple-50/40 border border-purple-100 rounded-xl h-fit">
                <h3 className="font-bold text-purple-800 mb-4">Surgery Details</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-gray-500">Type:</span> {surgery.type}</p>
                  <p><span className="text-gray-500">Duration:</span> {surgery.duration}</p>
                  <p><span className="text-gray-500">Outcome:</span> {surgery.outcome}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm italic">No surgical records found.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Documents */}
        {activeTab === "Documents" && (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents?.prescriptions ? (
              <a href={documents.prescriptions} target="_blank" rel="noreferrer" className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center group">
                <p className="font-bold text-gray-800 group-hover:text-blue-600">Prescription Document</p>
                <p className="text-xs text-gray-400 mt-1">Click to view file</p>
              </a>
            ) : null}
            {documents?.lab_results ? (
              <a href={documents.lab_results} target="_blank" rel="noreferrer" className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-center group">
                <p className="font-bold text-gray-800 group-hover:text-green-600">Lab Reports</p>
                <p className="text-xs text-gray-400 mt-1">Click to view file</p>
              </a>
            ) : null}
            {!documents?.prescriptions && !documents?.lab_results && (
              <p className="col-span-2 text-center text-gray-400 py-10">No documents found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}