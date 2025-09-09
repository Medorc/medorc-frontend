import React from 'react'
import NavBar from '../../Components/NavBar'
import NavButton from '../../Components/NavButton'

export default function ProfileSettings() {
  return (
    <div className='w-full min-h-screen bg-gray-100'>
    <NavBar/>
    <div className='w-full h-15 flex justify-center items-center'>
        <button className='bg-[#4A82B3] py-1 px-4 text-white font-bold '>← Back</button>
      <h1 className='font-medium text-3xl text-[#0751A7] '>Profile & Settings </h1>
    </div>
    <NavButton/>
    <div className='w-full h-120 flex flex-col justify-between gap-6 items-center text-gray-400 font-semibold text-2xl'>
        <div className="w-300 h-70 border-2 bg-white  rounded-lg p-4"> 
            <h3 className='text-[#0751A7]'>Personal Details</h3>
            <label className='text-sm'>Name:</label><span className='text-black'> Arun K</span><br/>
            <label className='text-sm'>Date of birth</label><span className='text-black'>Arun@gmail.com</span><br />
            <label className='text-sm'>Gender</label><span className='text-black'>Arun@gmail.com</span>
            <label htmlFor="Address">Address</label>
            <span className='text-black '>123, Main Street, City, Country</span>
            
        </div>
        <div className="w-300 h-50 border-2 bg-white  rounded-lg p-4 ">
            <h3 className='text-[#0751A7]'>LifeStyle</h3>
        </div>
    </div>
    </div>
  )
}
