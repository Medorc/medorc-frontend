import React from 'react';

// 1. Accept 'data', 'handleChange', and 'onNext' as props
function AddRecordForm({ data, handleChange, onNext }) {
  const inputBaseClass = "w-full p-1 border border-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base";
  const labelBaseClass = "block mb-2 py-2 font-semibold text-black";

  // 2. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    onNext(); // Call the parent's 'handleNext' function
  };

  return (
    <div className="w-full max-w-4xl m-4 md:m-8">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4 py-4 md:mb-8 md:py-8 tracking-wide">
        DETAILS FOR RECORD
      </h2>
      <main className="bg-white border border-black pt-6 md:pt-[30px] pb-10 px-4 md:px-8 shadow-lg relative z-10">
        {/* 3. Add onSubmit to the form tag */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Column 1 */}
            <div className="flex-1 min-w-[300px]">
              <div className="mb-5">
                <label htmlFor="entryType" className={labelBaseClass}>Entry type</label>
                {/* 4. Set 'value' and 'onChange' for every input */}
                <input 
                  type="text" 
                  id="entryType" 
                  value={data.entry_type}
                  onChange={(e) => handleChange('basicDetails', 'entry_type', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="diagnosisName" className={labelBaseClass}>Diagnosis name</label>
                <input 
                  type="text" 
                  id="diagnosisName" 
                  value={data.diagnosis_name}
                  onChange={(e) => handleChange('basicDetails', 'diagnosis_name', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="history" className={labelBaseClass}>History of present illness</label>
                <textarea 
                  id="history" 
                  rows="4" 
                  value={data.history_of_present_illness}
                  onChange={(e) => handleChange('basicDetails', 'history_of_present_illness', e.target.value)}
                  className={`${inputBaseClass} resize-y`}
                ></textarea>
              </div>
              
              <div className="mb-5">
                <label htmlFor="treatment" className={labelBaseClass}>Treatment undergone</label>
                <textarea 
                  id="treatment" 
                  rows="3" 
                  value={data.treatment_undergone}
                  onChange={(e) => handleChange('basicDetails', 'treatment_undergone', e.target.value)}
                  className={`${inputBaseClass} resize-y`}
                ></textarea>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 min-w-[300px]">
              <div className="mb-5">
                <label htmlFor="doctorName" className={labelBaseClass}>Doctor name</label>
                <input 
                  type="text" 
                  id="doctorName" 
                  value={data.doctor_name}
                  onChange={(e) => handleChange('basicDetails', 'doctor_name', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="hospitalName" className={labelBaseClass}>Hospital name</label>
                <input 
                  type="text" 
                  id="hospitalName" 
                  value={data.hospital_name}
                  onChange={(e) => handleChange('basicDetails', 'hospital_name', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="appointmentDate" className={labelBaseClass}>Appointment date</label>
                <input 
                  type="date" // Using 'date' type is better
                  id="appointmentDate" 
                  value={data.appointment_date}
                  onChange={(e) => handleChange('basicDetails', 'appointment_date', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="regNo" className={labelBaseClass}>Reg. No</label>
                <input 
                  type="text" 
                  id="regNo" 
                  value={data.reg_no || ''} // Handle fields not in initial state
                  onChange={(e) => handleChange('basicDetails', 'reg_no', e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="alternativeMedicine" className={labelBaseClass}>Alternative system of medicine</label>
                <textarea 
                  id="alternativeMedicine" 
                  rows="3" 
                  value={data.alternative_medicine || ''}
                  onChange={(e) => handleChange('basicDetails', 'alternative_medicine', e.target.value)}
                  className={`${inputBaseClass} resize-y`}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Button Container */}
          <div className="flex flex-col md:flex-row md:justify-end gap-4 md:gap-8 mt-8 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              className="py-3 w-full md:w-auto md:px-20 rounded-full font-semibold bg-[#4A90E2] text-base text-white hover:bg-[#207FEE] cursor-pointer transition-all duration-300"
            >
              Cancel
            </button>
            {/* 5. Changed to type="submit" */}
            <button 
              type="submit"
              className="py-3 w-full md:w-auto md:px-20 rounded-full font-semibold text-base bg-[#4A90E2] text-white hover:bg-[#207FEE] cursor-pointer transition-all duration-300"
            >
              Next
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddRecordForm;