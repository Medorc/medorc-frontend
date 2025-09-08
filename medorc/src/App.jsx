import './App.css'
import SignIn from './Pages/Login/Signin'
import { ToastContainer } from 'react-toastify';
import SPatient from './Pages/Login/SignUp/SPatient'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/patient' element={<SPatient />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
