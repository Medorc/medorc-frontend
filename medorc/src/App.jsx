import './App.css'
import SignIn from './Pages/Login/SignIn'
import { ToastContainer } from 'react-toastify';
import SPatient from './Pages/Login/SignUp/SPatient'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Patient/Home';
import SignUp from './Pages/Login/SignUp';
import ProfileSettings from './Pages/Patient/ProfileSettings';
import Account from './Pages/Patient/Account';
import Emergency from './Pages/Patient/Emergency';
import Logs from './Pages/Patient/Logs';

function App() {


  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/patient' element={<SPatient />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile/settings' element={<ProfileSettings />} />
          <Route path='/security' element={<Account />} />
          <Route path='/emergency' element={<Emergency />} />
          <Route path='/logs' element={<Logs />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
