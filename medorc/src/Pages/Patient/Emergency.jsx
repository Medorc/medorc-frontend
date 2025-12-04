import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import { FaTimesCircle } from "react-icons/fa";

import NavButton from "../../Components/NavButton";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "../../Components/BackButton";

// API URLs
const URL = "http://localhost:3000/api/v1/patient/profile/";
const CONTACTS_ENDPOINT = "emergency-contacts";
const CONTACT_ENDPOINT = "emergency-contact";

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone_no: "",
    relation: "",
  });

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(URL + CONTACTS_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data.data.patient_emergency_contacts || []);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, [token]);

  const resetFormAndCloseModal = () => {
    setShowModal(false);
    setForm({ full_name: "", phone_no: "", relation: "" });
  };

  const handleSave = async () => {
    try {
      if(!form.full_name || !form.phone_no || !form.relation){
        toast.error("All fields are required!");
        return;
      }
      if(form.phone_no.length !== 10){
        toast.error("Phone number must be 10 digits!");
        return;
      }
      

      const res = await axios.post(
        URL + CONTACT_ENDPOINT,
        { newEmergencyContact: form },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts([...contacts, res.data.data]);
      toast.success("Contact saved!");
      resetFormAndCloseModal();
    } catch (err) {
      toast.error("Save Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (emgIdToDelete) => {
    try {
      await axios.delete(URL + CONTACT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
        data: { emg_id: emgIdToDelete },
      });
      setContacts(contacts.filter((contact) => contact.emg_id !== emgIdToDelete));
      toast.success("Contact deleted!");
    } catch (err) {
      toast.error("Delete Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddNew = () => {
    resetFormAndCloseModal();
    setShowModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <NavBar />
      
      <BackButton/>

      <NavButton />

      <div className="w-full max-w-4xl my-8 flex flex-col gap-8 space-y-6 px-4">
        {contacts.map((contact) => (
          <div
            key={contact.emg_id}
            
            className="w-full bg-white border  p-4 md:p-8 shadow-sm">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              
              <div className="flex flex-col md:flex-row gap-4 flex-grow">
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Name</label>
                  <p className="border rounded px-3 py-1 bg-gray-50">{contact.full_name}</p>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Phone</label>
                  <p className="border rounded px-3 py-1 bg-gray-50">{contact.phone_no}</p>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Relation</label>
                  <p className="border rounded px-3 py-1 bg-gray-50">{contact.relation}</p>
                </div>
              </div>
             
              <div className="flex items-center self-end mt-4 md:mt-0 md:self-center md:ml-4">
                <button
                  className="text-gray-600 hover:text-red-500 p-2 "
                  onClick={() => handleDelete(contact.emg_id)}
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Count */}
      {contacts.length > 0 && (
        <div className="text-center text-gray-500 text-sm mt-4 p-4">
          You can add {3 - contacts.length} more contacts.
        </div>
      )}

      {/* Add Contact Button */}
      {contacts.length < 3 && (
        <button
          className="bg-[#4A90E2] text-white font-bold py-2 px-6 rounded mt-8 mb-8 hover:bg-[#4A99E4] transition duration-300"
          onClick={handleAddNew}
        >
          Add Contact
        </button>
      )}

      {/* Modal ... (no changes below this line) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#0751A7]">
              Add Emergency Contact
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border rounded px-3 py-2"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Phone"
                className="border rounded px-3 py-2"
                value={form.phone_no}
                onChange={(e) => setForm({ ...form, phone_no: e.target.value })}
              />
              <input
                type="text"
                placeholder="Relation"
                className="border rounded px-3 py-2"
                value={form.relation}
                onChange={(e) => setForm({ ...form, relation: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6 ">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={resetFormAndCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-[#4A90E2] text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}