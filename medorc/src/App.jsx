import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import NavBar from './Components/NavBar/NavBar'
import SignIn from './Pages/Login/Signin'
import { ToastContainer } from 'react-toastify';
import SignUp from './Pages/Login/SignUp'
import SPatient from './Pages/Login/SignUp/SPatient'


function App() {
  

  return (
    <>
      <ToastContainer />
      
       <SPatient/>
    </>
  )
}

export default App
