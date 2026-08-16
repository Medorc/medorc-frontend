import { lazy, Suspense } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Loading from "./Components/Loading";

// Auth Components
const SignUp = lazy(() => import("./Pages/Login/SignUp"));
const SignIn = lazy(() => import("./Pages/Login/SignIn"));
const SPatient = lazy(() => import("./Pages/Login/SignUp/SPatient"));
const SDoctor = lazy(() => import("./Pages/Login/SignUp/SDoctor"));
const SHospital = lazy(() => import("./Pages/Login/SignUp/SHostpital"));
const SExternal = lazy(() => import("./Pages/Login/SignUp/SExternal"));

// Patient Pages
const Home = lazy(() => import("./Pages/Patient/Home"));
const ProfileSettings = lazy(() => import("./Pages/Patient/ProfileSettings"));
const Account = lazy(() => import("./Pages/Patient/Account"));
const Emergency = lazy(() => import("./Pages/Patient/Emergency"));
const Logs = lazy(() => import("./Pages/Patient/Logs"));
const Records = lazy(() => import("./Pages/Patient/Records"));

// Doctor Pages
const DoctorHome = lazy(() => import("./Pages/Doctor/DoctorHome"));
const DoctorProfile = lazy(() => import("./Pages/Doctor/DoctorProfile"));
const DoctorSecurity = lazy(() => import("./Pages/Doctor/Account"));

// Hospital Pages
const HospitalHome = lazy(() => import("./Pages/Hospital/HospitalHome"));
const HospitalProfile = lazy(() => import("./Pages/Hospital/HospitalProfile"));
const HospitalSecurity = lazy(() => import("./Pages/Hospital/Account"));

// External Pages
const ExternProfile = lazy(() => import("./Pages/Extern/ExternProfile"));
const ExternHome = lazy(() => import("./Pages/Extern/ExternHome"));
const ExternAccount = lazy(() => import("./Pages/Extern/Account"));

// Common Patient Record Pages
const PatientRecords = lazy(() => import("./Pages/Common/PatientRecord"));
const CreateRecord = lazy(() => import("./Pages/Common/CreateRecordPage"));
const PatientDetails = lazy(() => import("./Pages/Common/PatientBasicDetails"));
const PatientProfile = lazy(() => import("./Pages/Common/PatientProfile"));
const RecordView = lazy(() => import("./Pages/Common/RecordView"));

// Protected Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";

const NotFound = lazy(() => import("./Pages/NotFound"));

const withSuspense = (element) => <Suspense fallback={<Loading />}>{element}</Suspense>;

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={withSuspense(<SignIn />)} />
          <Route path="/signin" element={withSuspense(<SignIn />)} />
          <Route path="/SignUp" element={withSuspense(<SignUp />)} />
          <Route path="/signup" element={withSuspense(<SignUp />)} />

          {/* Standardized Sign-Up Routes */}
          <Route path="/signup/patient" element={withSuspense(<SPatient />)} />
          <Route path="/signup/doctor" element={withSuspense(<SDoctor />)} />
          <Route path="/signup/hospital" element={withSuspense(<SHospital />)} />
          <Route path="/signup/external" element={withSuspense(<SExternal />)} />

          {/* Backward Compatibility Sign-Up Routes */}
          <Route path="/patient" element={withSuspense(<SPatient />)} />
          <Route path="/sDoctor" element={withSuspense(<SDoctor />)} />
          <Route path="/sHospital" element={withSuspense(<SHospital />)} />
          <Route path="/sExternal" element={withSuspense(<SExternal />)} />

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/patient/home" element={withSuspense(<Home />)} />
            <Route path="/patient/profile" element={withSuspense(<ProfileSettings />)} />
            <Route path="/patient/security" element={withSuspense(<Account />)} />
            <Route path="/patient/emergency" element={withSuspense(<Emergency />)} />
            <Route path="/patient/logs" element={withSuspense(<Logs />)} />
            <Route path="/patient/addrecord" element={withSuspense(<CreateRecord />)} />
            <Route path="/patient/records" element={withSuspense(<Records />)} />
          </Route>

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor/home" element={withSuspense(<DoctorHome />)} />
            <Route path="/doctor/profile" element={withSuspense(<DoctorProfile />)} />
            <Route path="/doctor/security" element={withSuspense(<DoctorSecurity />)} />
            <Route path="/doctor/records" element={withSuspense(<PatientRecords />)} />
            <Route path="/doctor/addrecord" element={withSuspense(<CreateRecord />)} />
            <Route path="/doctor/patientbasicdetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/doctor/PatientBasicDetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/doctor/patientprofile" element={withSuspense(<PatientProfile />)} />
          </Route>

          {/* Protected Hospital Routes */}
          <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
            <Route path="/hospital/home" element={withSuspense(<HospitalHome />)} />
            <Route path="/hospital/profile" element={withSuspense(<HospitalProfile />)} />
            <Route path="/hospital/security" element={withSuspense(<HospitalSecurity />)} />
            <Route path="/hospital/records" element={withSuspense(<PatientRecords />)} />
            <Route path="/hospital/addrecord" element={withSuspense(<CreateRecord />)} />
            <Route path="/hospital/patientbasicdetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/hospital/PatientBasicDetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/hospital/patientprofile" element={withSuspense(<PatientProfile />)} />
          </Route>

          {/* Protected External Routes */}
          <Route element={<ProtectedRoute allowedRoles={["extern"]} />}>
            <Route path="/extern/home" element={withSuspense(<ExternHome />)} />
            <Route path="/extern/profile" element={withSuspense(<ExternProfile />)} />
            <Route path="/extern/records" element={withSuspense(<PatientRecords />)} />
            <Route path="/extern/patientbasicdetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/extern/PatientBasicDetails" element={withSuspense(<PatientDetails />)} />
            <Route path="/extern/patientrecords" element={withSuspense(<PatientRecords />)} />
            <Route path="/extern/security" element={withSuspense(<ExternAccount />)} />
            <Route path="/extern/patientprofile" element={withSuspense(<PatientProfile />)} />
          </Route>

          {/* Protected Common Record View */}
          <Route element={<ProtectedRoute allowedRoles={["patient", "doctor", "hospital", "extern"]} />}>
            <Route path="/recordview/:record_id" element={withSuspense(<RecordView />)} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={withSuspense(<NotFound />)} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
