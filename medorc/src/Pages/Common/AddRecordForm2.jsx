import React, { useRef } from 'react'; // 1. Import useRef

function AddRecordForm2({ 
  data, 
  uploading, // 2. Accept 'uploading' prop
  handleChange, 
  handleToggle, 
  handleFileUpload, 
  onBack, 
  onSubmit 
}) {
  
  // 3. Create refs for the hidden file inputs
  const prescriptionInputRef = useRef(null);
  const labResultInputRef = useRef(null);

  // 4. Handlers for the visible buttons to click the hidden inputs
  const handlePrescriptionClick = () => {
    prescriptionInputRef.current.click();
  };

  const handleLabResultClick = () => {
    labResultInputRef.current.click();
  };

  // 5. A handler for when a file is selected
  const onFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, documentType);
    }
    // Clear the input value so the user can re-upload the same file
    e.target.value = null; 
  };

  // --- (Base classes) ---
  const inputBaseClass = "w-full p-1 border border-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base";
  const labelBaseClass = "block mb-2 py-2 font-semibold text-black";
  const sectionTitleClass = "text-lg font-semibold text-gray-800 flex items-center justify-between mb-4";
  
  // --- (File upload button classes) ---
  const fileButtonBaseClass = "py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 w-full";
  const fileEnabledClass = "bg-[#4A90E2] hover:bg-[#207FEE]";
  const fileDisabledClass = "bg-gray-400 cursor-not-allowed";

  // --- (Navigation button classes - THIS WAS THE FIX) ---
  const navButtonClass = "py-3 w-full md:w-auto md:px-20 rounded-full font-semibold text-base bg-[#4A90E2] text-white hover:bg-[#207FEE] cursor-pointer transition-all duration-300";

  return (
    <div className="w-full max-w-4xl m-4 md:m-8">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4 py-4 md:mb-8 md:py-8 tracking-wide">
        DETAILS FOR RECORD
      </h2>
      <main className="bg-white border border-black pt-6 md:pt-[30px] pb-10 px-4 md:px-8 shadow-lg relative z-10">
        <form onSubmit={onSubmit}>
          {/* --- Hospitalization & Surgery sections --- */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            
            {/* Hospitalization Details Column (FIX 1 APPLIED) */}
            <div className={`${data.ui.showHospitalization ? 'flex-1' : ''} min-w-[300px] border border-gray-300 p-4 rounded-md`}>
              <div className={sectionTitleClass}>
                <span>Hospitalization Details</span>
                <input 
                  type="checkbox" 
                  checked={data.ui.showHospitalization}
                  onChange={() => handleToggle('showHospitalization')}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-sm"
                />
              </div>
              
              {data.ui.showHospitalization && (
                <>
                  <div className="mb-5">
                    <label htmlFor="roomNo" className={labelBaseClass}>Room no.</label>
                    <input type="text" id="roomNo" value={data.hospitalizationDetails.room_no} onChange={(e) => handleChange('hospitalizationDetails', 'room_no', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="reasonHospitalization" className={labelBaseClass}>Reason for hospitalization</label>
                    <input type="text" id="reasonHospitalization" value={data.hospitalizationDetails.reason} onChange={(e) => handleChange('hospitalizationDetails', 'reason', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="hospTreatment" className={labelBaseClass}>Treatment undergone</label>
                    <input type="text" id="hospTreatment" value={data.hospitalizationDetails.treatment_undergone} onChange={(e) => handleChange('hospitalizationDetails', 'treatment_undergone', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="hospDuration" className={labelBaseClass}>Duration</label>
                    <input type="text" id="hospDuration" value={data.hospitalizationDetails.duration} onChange={(e) => handleChange('hospitalizationDetails', 'duration', e.target.value)} className={inputBaseClass} />
                  </div>
                </>
              )}
            </div>
            
            {/* Surgery Details Column (FIX 1 APPLIED) */}
            <div className={`${data.ui.showSurgery ? 'flex-1' : ''} min-w-[300px] border border-gray-300 p-4 rounded-md`}>
              <div className={sectionTitleClass}>
                <span>Surgery Details</span>
                <input 
                  type="checkbox" 
                  checked={data.ui.showSurgery}
                  onChange={() => handleToggle('showSurgery')}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-sm"
                />
              </div>
              
              {data.ui.showSurgery && (
                <>
                  <div className="mb-5">
                    <label htmlFor="surgeryType" className={labelBaseClass}>Type</label>
                    <input type="text" id="surgeryType" value={data.surgeryDetails.type} onChange={(e) => handleChange('surgeryDetails', 'type', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="surgeryDuration" className={labelBaseClass}>Duration</label>
                    <input type="text" id="surgeryDuration" value={data.surgeryDetails.duration} onChange={(e) => handleChange('surgeryDetails', 'duration', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="bedNo" className={labelBaseClass}>Bed No.</label>
                    <input type="text" id="bedNo" value={data.surgeryDetails.bed_no} onChange={(e) => handleChange('surgeryDetails', 'bed_no', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="medicalCondition" className={labelBaseClass}>Medical condition</label>
                    <input type="text" id="medicalCondition" value={data.surgeryDetails.medical_condition} onChange={(e) => handleChange('surgeryDetails', 'medical_condition', e.target.value)} className={inputBaseClass} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="outcome" className={labelBaseClass}>Outcome</label>
                    <input type="text" id="outcome" value={data.surgeryDetails.outcome} onChange={(e) => handleChange('surgeryDetails', 'outcome', e.target.value)} className={inputBaseClass} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* --- Documents Section --- */}
          <div className="mb-8 p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents</h3>
            <div className="flex flex-col gap-4 max-w-sm">
              
              {/* Prescription Button */}
              <button 
                type="button" 
                onClick={handlePrescriptionClick}
                disabled={uploading.prescriptions}
                className={`${fileButtonBaseClass} ${uploading.prescriptions ? fileDisabledClass : fileEnabledClass}`}
              >
                {uploading.prescriptions ? 'Uploading...' : 'Add prescriptions'}
              </button>
              {data.documents.prescriptions && !uploading.prescriptions && (
                <a href={data.documents.prescriptions} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                  Prescription uploaded!
                </a>
              )}
              
              <input 
                type="file" 
                ref={prescriptionInputRef} 
                onChange={(e) => onFileChange(e, 'prescriptions')}
                className="hidden" 
                accept="application/pdf,image/png,image/jpeg"
                disabled={uploading.prescriptions}
              />
              
              {/* Lab Result Button */}
              <button 
                type="button" 
                onClick={handleLabResultClick}
                disabled={uploading.lab_results}
                className={`${fileButtonBaseClass} ${uploading.lab_results ? fileDisabledClass : fileEnabledClass}`}
              >
                {uploading.lab_results ? 'Uploading...' : 'Add lab results'}
              </button>
              {data.documents.lab_results && !uploading.lab_results && (
                <a href={data.documents.lab_results} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                  Lab results uploaded!
                </a>
              )}

              <input 
                type="file" 
                ref={labResultInputRef} 
                onChange={(e) => onFileChange(e, 'lab_results')}
                className="hidden" 
                accept="application/pdf,image/png,image/jpeg"
                disabled={uploading.lab_results}
              />
            </div>
          </div>
          
          {/* --- Button Container (FIX 2 APPLIED) --- */}
          <div className="flex flex-col md:flex-row md:justify-end gap-4 md:gap-8 mt-8 pt-6 border-t border-gray-200">
             <button 
                type="button" 
                onClick={onBack}
                className={navButtonClass} // Added the style class
             >
                Back
             </button>
             <button 
                type="submit" 
                className={navButtonClass} // Added the style class
             >
                Add
             </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddRecordForm2;