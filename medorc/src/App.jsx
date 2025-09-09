import './App.css'
import SignIn from './Pages/Login/SignIn'
import { ToastContainer } from 'react-toastify';
import SPatient from './Pages/Login/SignUp/SPatient'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Patient/Home';
import SignUp from './Pages/Login/SignUp';
import ProfileSettings from './Pages/Patient/ProfileSettings';

function App() {


  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/patient' element={<SPatient />} />
          <Route path='/:role/home' element={<Home />} />
          <Route path='/profile/settings' element={<ProfileSettings />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
