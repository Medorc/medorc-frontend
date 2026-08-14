import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Auth Components
import SignUp from "./Pages/Login/SignUp";
import SignIn from "./Pages/Login/SignIn";
import SPatient from "./Pages/Login/SignUp/SPatient";
import SDoctor from "./Pages/Login/SignUp/SDoctor";
import SHospital from "./Pages/Login/SignUp/SHostpital";
import SExternal from "./Pages/Login/SignUp/SExternal";

// Patient Pages
import Home from "./Pages/Patient/Home";
import ProfileSettings from "./Pages/Patient/ProfileSettings";
import Account from "./Pages/Patient/Account";
import Emergency from "./Pages/Patient/Emergency";
import Logs from "./Pages/Patient/Logs";
import Records from "./Pages/Patient/Records";

// Doctor Pages
import DoctorHome from "./Pages/Doctor/DoctorHome";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import DoctorSecurity from "./Pages/Doctor/Account";

// Hospital Pages
import HospitalHome from "./Pages/Hospital/HospitalHome";
import HospitalProfile from "./Pages/Hospital/HospitalProfile";
import HospitalSecurity from "./Pages/Hospital/Account";

// External Pages
import ExternProfile from "./Pages/Extern/ExternProfile";
import ExternHome from "./Pages/Extern/ExternHome";
import ExternAccount from "./Pages/Extern/Account";

// Common Patient Record Pages
import PatientRecords from "./Pages/Common/PatientRecord";
import CreateRecord from "./Pages/Common/CreateRecordPage";
import PatientDetails from "./Pages/Common/PatientBasicDetails";
import PatientProfile from "./Pages/Common/PatientProfile";
import RecordView from "./Pages/Common/RecordView";

// Protected Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />

          {/* Standardized Sign-Up Routes */}
          <Route path="/signup/patient" element={<SPatient />} />
          <Route path="/signup/doctor" element={<SDoctor />} />
          <Route path="/signup/hospital" element={<SHospital />} />
          <Route path="/signup/external" element={<SExternal />} />

          {/* Backward Compatibility Sign-Up Routes */}
          <Route path="/patient" element={<SPatient />} />
          <Route path="/sDoctor" element={<SDoctor />} />
          <Route path="/sHospital" element={<SHospital />} />
          <Route path="/sExternal" element={<SExternal />} />

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/patient/home" element={<Home />} />
            <Route path="/patient/profile" element={<ProfileSettings />} />
            <Route path="/patient/security" element={<Account />} />
            <Route path="/patient/emergency" element={<Emergency />} />
            <Route path="/patient/logs" element={<Logs />} />
            <Route path="/patient/addrecord" element={<CreateRecord />} />
            <Route path="/patient/records" element={<Records />} />
          </Route>

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor/home" element={<DoctorHome />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/security" element={<DoctorSecurity />} />
            <Route path="/doctor/records" element={<PatientRecords />} />
            <Route path="/doctor/addrecord" element={<CreateRecord />} />
            <Route path="/doctor/patientbasicdetails" element={<PatientDetails />} />
            <Route path="/doctor/PatientBasicDetails" element={<PatientDetails />} />
            <Route path="/doctor/patientprofile" element={<PatientProfile />} />
          </Route>

          {/* Protected Hospital Routes */}
          <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
            <Route path="/hospital/home" element={<HospitalHome />} />
            <Route path="/hospital/profile" element={<HospitalProfile />} />
            <Route path="/hospital/security" element={<HospitalSecurity />} />
            <Route path="/hospital/records" element={<PatientRecords />} />
            <Route path="/hospital/addrecord" element={<CreateRecord />} />
            <Route path="/hospital/patientbasicdetails" element={<PatientDetails />} />
            <Route path="/hospital/PatientBasicDetails" element={<PatientDetails />} />
            <Route path="/hospital/patientprofile" element={<PatientProfile />} />
          </Route>

          {/* Protected External Routes */}
          <Route element={<ProtectedRoute allowedRoles={["extern"]} />}>
            <Route path="/extern/home" element={<ExternHome />} />
            <Route path="/extern/profile" element={<ExternProfile />} />
            <Route path="/extern/records" element={<PatientRecords />} />
            <Route path="/extern/patientbasicdetails" element={<PatientDetails />} />
            <Route path="/extern/PatientBasicDetails" element={<PatientDetails />} />
            <Route path="/extern/patientrecords" element={<PatientRecords />} />
            <Route path="/extern/security" element={<ExternAccount />} />
            <Route path="/extern/patientprofile" element={<PatientProfile />} />
          </Route>

          {/* Protected Common Record View */}
          <Route element={<ProtectedRoute allowedRoles={["patient", "doctor", "hospital", "extern"]} />}>
            <Route path="/recordview/:record_id" element={<RecordView />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
