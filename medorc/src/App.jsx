import "./App.css";
import SignIn from "./Pages/Login/SignIn";
import { ToastContainer } from "react-toastify";
import SPatient from "./Pages/Login/SignUp/SPatient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Patient/Home";
import SignUp from "./Pages/Login/SignUp";
import ProfileSettings from "./Pages/Patient/ProfileSettings";
import Account from "./Pages/Patient/Account";
import Emergency from "./Pages/Patient/Emergency";
import Logs from "./Pages/Patient/Logs";

import CreateRecordPage from "./Pages/Patient/CreateRecordPage";
import Records from "./Pages/Patient/Records";


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
