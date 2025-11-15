import React from 'react';
import { FaSearch, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import NavBar from '../../Components/NavBar';

export default function Records() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 1. TOP HEADER BAR */}
      
        <NavBar/>

      <main className="p-4 md:p-8 lg:px-20 lg:py-10 flex flex-col gap-8">
        {/* 2. PAGE HEADER */}
        <section className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-3 border-[#50E3C2]"></div>
            <div>
              <h1 className="text-3xl font-bold text-[#0751A7]">
                Medical Records
              </h1>
              <p className="text-black-300 text-lg">John Doe</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-all">
              <FaArrowLeft /> Back
            </button>
            <button className="py-2 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
              Add Record
            </button>
            <button className="py-2 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
              Ask Orby
            </button>
          </div>
        </section>

        {/* 3. FILTER & SEARCH BAR */}
        <section className="bg-white p-6 rounded shadow-sm mb-8 border border-black">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Filter & Search
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 flex-grow">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none p-3 text-base outline-none w-full"
              />
            </div>
            <select className="p-3 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>All Records</option>
              <option>Self Entries</option>
              <option>Doctor</option>
              <option>Hospitalization</option>
            </select>
            <select className="p-3 border border-gray-200 rounded-lg bg-white text-gray-700">
              
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>By Diagnosis</option>
            </select>
          </div>
        </section>

        {/* 4. RECORDS LIST */}
        <section className="space-y-6 border rounded">
          {/* Single Record Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-black">Hyper Tension</h3>
                <span className="py-1 px-3 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                  Doctor
                </span>
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <button className="bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition-all self-start sm:self-center">
                View Details
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">Jan 15, 2024 16:00</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs text-gray-500 uppercase mb-1">
                  Doctor
                </label>
                <p className="font-semibold text-gray-800">Dr. Sarah Johnson</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase mb-1">
                  Hospital
                </label>
                <p className="font-semibold text-gray-800">—</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 uppercase mb-1">
                  History of present illness
                </label>
                <p className="font-semibold text-gray-800">
                  Patient complains of persistent illness and headaches
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 pt-6 mt-6 gap-4">
              <div className="flex gap-2 flex-wrap">
                <span className="py-1 px-3 rounded-full text-xs font-semibold bg-orange-50 text-orange-500">
                  Hospitalization
                </span>
                <span className="py-1 px-3 rounded-full text-xs font-semibold bg-pink-50 text-pink-500">
                  Surgery
                </span>
                <span className="py-1 px-3 rounded-full text-xs font-semibold bg-sky-50 text-sky-500">
                  1 Document(s)
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                Reg No.: REG0001
              </span>
            </div>
          </div>
          {/* More cards would go here */}
        </section>
      </main>
    </div>
  );
}