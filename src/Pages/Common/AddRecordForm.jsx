import React from "react";
import { useNavigate } from "react-router-dom";

function AddRecordForm({ data, handleChange, onNext }) {
  const navigate = useNavigate();

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const labelClass =
    "mb-1 block text-sm font-medium text-gray-700 pb-1";

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Header */}
      <h2 className="mb-8 text-center text-xl font-semibold tracking-wide text-gray-800 pb-2">
        Record Details
      </h2>

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Diagnosis */}
            <div>
              <label className={labelClass}>Diagnosis name</label>
              <input
                type="text"
                value={data.diagnosis_name}
                onChange={(e) =>
                  handleChange("basicDetails", "diagnosis_name", e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* Doctor */}
            <div>
              <label className={labelClass}>Doctor name</label>
              <input
                type="text"
                value={data.doctor_name}
                onChange={(e) =>
                  handleChange("basicDetails", "doctor_name", e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* History */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                History of present illness
              </label>
              <textarea
                rows="3"
                value={data.history_of_present_illness}
                onChange={(e) =>
                  handleChange(
                    "basicDetails",
                    "history_of_present_illness",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {/* Treatment */}
            <div className="md:col-span-2">
              <label className={labelClass}>Treatment undergone</label>
              <textarea
                rows="3"
                value={data.treatment_undergone}
                onChange={(e) =>
                  handleChange(
                    "basicDetails",
                    "treatment_undergone",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {/* Hospital */}
            <div>
              <label className={labelClass}>Hospital name</label>
              <input
                type="text"
                value={data.hospital_name}
                onChange={(e) =>
                  handleChange("basicDetails", "hospital_name", e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* Appointment Date */}
            <div>
              <label className={labelClass}>Appointment date</label>
              <input
                type="date"
                value={data.appointment_date}
                onChange={(e) =>
                  handleChange(
                    "basicDetails",
                    "appointment_date",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {/* Reg No */}
            <div>
              <label className={labelClass}>Reg. No</label>
              <input
                type="text"
                value={data.reg_no || ""}
                onChange={(e) =>
                  handleChange("basicDetails", "reg_no", e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* Alternative Medicine */}
            <div>
              <label className={labelClass}>
                Alternative system of medicine
              </label>
              <textarea
                rows="2"
                value={data.alternative_medicine || ""}
                onChange={(e) =>
                  handleChange(
                    "basicDetails",
                    "alternative_medicine",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecordForm;
