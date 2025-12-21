import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import NavBar from "../../Components/NavBar";

export default function RecordView() {
  const [activeTab, setActiveTab] = useState("General");

  // Dummy data matching the screenshot
  const data = {
    diagnosis: "Hyper tension",
    entryType: "Doctor",
    appointmentDate: "January 15th, 2025",
    registrationNo: "REC0001",
    doctorName: "Dr. Sarah Johnson",
    hospitalName: "City General Hospital",
    history: "Acute onset of right lower quadrant pain, nausea, and fever.",
    treatment: "Emergency appendectomy performed",
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 ">
        <NavBar/>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-sm p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.diagnosis}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-500 text-xs font-medium border border-blue-200">
              {data.entryType}
            </span>
            <FaEye className="text-green-500 text-lg" />
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <IoMdClose size={24} />
          </button>
        </div>

        <p className="text-xs text-gray-400 -mt-5 mb-6">
          Detailed medical record information
        </p>

        {/* Tabs */}
        <div className="w-full bg-gray-100 p-1 rounded-md flex mb-8">
          {["General", "Treatment", "Procedures", "Documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content - General Tab */}
        {activeTab === "General" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                {/* Empty first col for alignment matches mockup roughly or just standard grid */}
                {/* The mockup has 'Appointment Date' left, 'Entry type' middle, 'Registration No' right roughly? 
                     Actually looks like:
                     Row 1: [Space] [Entry Type] [Space]
                     Row 2: [Date] [Reg No]
                 */}
                {/* Replicating the grid from screenshot closer */}
                <div></div>{" "}
                {/* Empty spacer if trying to match exact white space or just auto layout */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">
                    Entry type:
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {data.entryType}
                  </span>
                </div>
                <div></div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">
                    Appointment Date:
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {data.appointmentDate}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">
                    Registration No:
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {data.registrationNo}
                  </span>
                </div>
              </div>
              <div className="border-b border-gray-200 mt-8 mb-8"></div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-6">
                Healthcare provider
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {data.doctorName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Hospital:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {data.hospitalName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content - Treatment Tab */}
        {activeTab === "Treatment" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                History of present illness
              </h2>
              <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                {data.history}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Treatment undergone
              </h2>
              <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                {data.treatment}
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {(activeTab === "Procedures" || activeTab === "Documents") && (
          <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
            No information available for {activeTab}
          </div>
        )}
      </div>
    </div>
  );
}
