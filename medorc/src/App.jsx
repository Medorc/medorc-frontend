import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";


{/* {Login} */}
import SignUp from "./Pages/Login/SignUp";
import SignIn from "./Pages/Login/SignIn";

{/* {Patient} */}
import SPatient from "./Pages/Login/SignUp/SPatient";
import Home from "./Pages/Patient/Home";
import ProfileSettings from "./Pages/Patient/ProfileSettings";
import Account from "./Pages/Patient/Account";
import Emergency from "./Pages/Patient/Emergency";
import Logs from "./Pages/Patient/Logs";
import CreateRecordPage from "./Pages/Patient/CreateRecordPage";
import Records from "./Pages/Patient/Records";


{/* {Doctor} */}
import DoctorHome from "./Pages/Doctor/DoctorHome";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import DoctorSecurity from "./Pages/Doctor/Account";

{/* {Hospital} */}
import HospitalHome from "./Pages/Hospital/HospitalHome";
import HospitalProfile from "./Pages/Hospital/HospitalProfile";
import HospitalSecurity from "./Pages/Hospital/Account";



{/* {External} */}
import ExternProfile from "./Pages/Extern/ExternProfile";
import PatientDetails from "./Pages/Extern/PatientBasicDetails";
import ExternHome from "./Pages/Extern/ExternHome";
import ExternAccount from "./Pages/Extern/Account";
import PatientRecords from "./Pages/Extern/PatientRecord";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* {Patient} */}
          <Route path="/" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/patient" element={<SPatient />} />
          <Route path="/patient/home" element={<Home />} />
          <Route path="/patient/profile" element={<ProfileSettings />} />
          <Route path="/patient/security" element={<Account />} />
          <Route path="/patient/emergency" element={<Emergency />} />
          <Route path="/patient/logs" element={<Logs />} />
          <Route path="/patient/addrecord" element={<CreateRecordPage />} />
          <Route path="/patient/records" element={<Records />} />

          {/* {Doctor} */}
          <Route path="/doctor/home" element={<DoctorHome />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/security" element={<DoctorSecurity />} />


          {/* {Hospital} */}
          <Route path="/hospital/home" element={<HospitalHome />} />
          <Route path="/hospital/profile" element={<HospitalProfile />} />
          <Route path="/hospital/security" element={<HospitalSecurity />} />


          {/* {External} */}
          <Route path="/extern/home" element={<ExternHome />} />
          <Route path="/extern/profile" element={<ExternProfile />} />
          <Route path="/extern/patientbasicdetails" element={<PatientDetails />} />
          <Route path="/extern/patientrecords" element={<PatientRecords />} />
          <Route path="/extern/security" element={<ExternAccount />}/>
          

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
